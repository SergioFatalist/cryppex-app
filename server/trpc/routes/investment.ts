import {
  type InvestmentsList,
  InvestmentsListSchema,
  type InvestmentSummary,
  InvestmentSummarySchema,
  ListRequestSchema,
  UuidFieldSchema,
} from "~/server/model/trpc";
import errorParser from "~/server/trpc/error-parser";
import { procedure, router } from "~/server/trpc/trpc";

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
        const where = { userId: input.id, closed: false };
        const agg = await prisma.investment.aggregate({
          where,
          _count: {
            id: true,
          },
          _sum: {
            amount: true,
            interest: true,
          },
        });
        return {
          count: agg._count.id,
          amount: agg._sum.amount || BigInt(0),
          interest: agg._sum.interest || BigInt(0),
        };
      } catch (error) {
        console.error(error);
        throw errorParser(error);
      }
    }),
});
