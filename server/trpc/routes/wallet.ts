import { ListRequestSchema, TransactionsList, TransactionsListSchema } from "~/server/model/trpc";
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
});
