import { InvestmentSummary } from "~/server/model/trpc";

export default async function (id: string): Promise<InvestmentSummary> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      balance: true,
    },
  });
  const agg = await prisma.investment.aggregate({
    where: {
      userId: id,
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
  const ret = {
    balance: user.balance,
    count: agg._count.id,
    amount: agg._sum.amount || BigInt(0),
    interest: agg._sum.interest || BigInt(0),
  };
  console.dir(ret);
  return ret;
}
