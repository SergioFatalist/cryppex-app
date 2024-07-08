import dayjs from "dayjs";
import {
  ApplyInvestSchema,
  type InvestmentsList,
  InvestmentsListSchema,
  type InvestmentSummary,
  InvestmentSummarySchema,
  ListRequestSchema,
  UuidFieldSchema,
} from "~/server/model/trpc";
import errorParser from "~/server/trpc/error-parser";
import { procedure, router } from "~/server/trpc/trpc";

const rates = [10, 20, 30];
const minimals = new Map<number, bigint>([
  [10, 100000000n],
  [20, 500000000n],
  [30, 1000000000n],
]);

export default router({
  list: procedure
    .input(ListRequestSchema)
    .output(InvestmentsListSchema)
    .query(async ({ input }): Promise<InvestmentsList> => {
      try {
        const where = { userId: input.userId, closed: false };
        const total = await prisma.investment.count({ where });
        const items = await prisma.investment.findMany({
          where,
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
  summary: procedure
    .input(UuidFieldSchema)
    .output(InvestmentSummarySchema)
    .query(async ({ input }): Promise<InvestmentSummary> => {
      try {
        const user = await prisma.user.findUniqueOrThrow({
          where: { id: input.id },
          select: {
            balance: true,
          },
        });
        const agg = await prisma.investment.aggregate({
          where: {
            userId: input.id,
            closed: false,
          },
          _count: {
            id: true,
          },
          _sum: {
            amount: true,
            interest: true,
          },
        });
        return {
          balance: user.balance,
          count: agg._count.id,
          amount: agg._sum.amount || BigInt(0),
          interest: agg._sum.interest || BigInt(0),
        };
      } catch (error) {
        console.error(error);
        throw errorParser(error);
      }
    }),
  apply: procedure.input(ApplyInvestSchema).mutation(async ({ input }) => {
    try {
      if (!rates.includes(input.rate)) {
        throw new Error("Invalid Rate specified");
      } else if (input.amount < minimals.get(input.rate)) {
        throw new Error("Invalid Amount specified");
      }

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
          where: { id: input.userId },
        });
        const balance = user.balance - input.amount;
        const locked = user.locked + input.amount;
        const startEpoch = dayjs().unix();
        const endEpoch = dayjs()
          .add(10 + input.rate, "days")
          .unix();
        await tx.investment.create({
          userId: input.userId,
          amount: input.amount,
          startEpoch,
          endEpoch,
          closed: false,
          interest: 0n,
        });
        await tx.user.update({
          where: { id: input.userId },
          data: {
            balance,
            locked,
            lastLoginEpoch: user.currLoginEpoch,
            currLoginEpoch: startEpoch,
          },
        });
      });
    } catch (error) {
      console.error(error);
      throw errorParser(error);
    }
  }),
});
