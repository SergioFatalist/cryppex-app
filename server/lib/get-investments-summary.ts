import type { InvestmentSummary } from "~/server/lib/schema";

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
  return {
    balance: Number(user.balance),
    count: Number(agg._count.id),
    amount: Number(agg._sum.amount || 0),
    interest: Number(agg._sum.interest || 0),
  };
}
