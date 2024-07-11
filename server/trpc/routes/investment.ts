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
import getInvestmentsSummary from "~/server/trpc/handlers/get-investments-summary";
import { procedure, router } from "~/server/trpc/trpc";

const minimals = new Map<number, bigint>([
  [10, BigInt(100000000)],
  [20, BigInt(500000000)],
  [30, BigInt(1000000000)],
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
          orderBy: { endEpoch: "asc" },
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
        return getInvestmentsSummary(input.id);
      } catch (error) {
        console.error(error);
        throw errorParser(error);
      }
    }),
  apply: procedure.input(ApplyInvestSchema).mutation(async ({ input }) => {
    try {
      if (!minimals.get(input.rate) || (minimals.get(input.rate) ?? 0) > input.amount) {
        throw new Error("Invalid Data specified");
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
          data: {
            amount: input.amount,
            rate: input.rate,
            startEpoch,
            endEpoch,
            closed: false,
            interest: BigInt(0),
            user: {
              connect: {
                id: input.userId,
              },
            },
          },
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
