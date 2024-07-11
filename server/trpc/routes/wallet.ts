import { ListRequestSchema, SendSchema, type TransactionsList, TransactionsListSchema } from "~/server/model/trpc";
import errorParser from "~/server/trpc/error-parser";
import { procedure, router } from "~/server/trpc/trpc";

export default router({
  list: procedure
    .input(ListRequestSchema)
    .output(TransactionsListSchema)
    .query(async ({ input }): Promise<TransactionsList> => {
      try {
        const where = { userId: input.userId };
        const total = await prisma.transaction.count({ where });
        const items = await prisma.transaction.findMany({
          where,
          select: {
            id: true,
            startEpoch: true,
            endEpoch: true,
            referral: true,
            amount: true,
            success: true,
            operation: true,
          },
          ...parsePagination(input.pagination),
        });
        return {
          pagination: { ...input.pagination, total },
          items,
        };
      } catch (error) {
        console.error(error);
        throw errorParser(error);
      }
    }),
  send: procedure.input(SendSchema).mutation(async ({ input }) => {
    try {
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
          where: { id: input.userId },
        });
        if (user && user.balance > input.amount) {
          const trxTX = await tronWeb.trx.send(input.to, Number(input.amount));
          console.dir(JSON.stringify(trxTX));
          if (trxTX.result) {
            user.balance -= input.amount;
            await tx.transaction.create({
              data: {
                amount: input.amount,
                startEpoch: Math.round(trxTX.transaction.raw_data.timestamp / 1000),
                txId: trxTX.transaction.txID,
                operation: "withdraw",
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });
            await tx.user.update({
              where: {id: user.id},
              data: {
                balance: user.balance,
              },
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
      throw errorParser(error);
    }
  }),
});
