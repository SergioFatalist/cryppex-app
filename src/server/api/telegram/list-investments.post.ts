import { type InvestmentsList } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<InvestmentsList> => {
  const userId = (event.context.user as WebAppUser).id;
  const items = await prisma.investment.findMany({
    where: { userId, closed: false },
    orderBy: { finish: "asc" },
  });
  return items.map((i) => ({
    id: Number(i.id),
    amount: parseFloat((Number(i.amount) / 1_000_000).toFixed(2)),
    rate: i.rate,
    interest: parseFloat((Number(i.interest) / 1_000_000).toFixed(2)),
    start: Number(i.start),
    finish: Number(i.finish),
  }));
});
