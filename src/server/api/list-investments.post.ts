import pagination from "@/server/lib/pagination";
import { type InvestmentsList, PaginatiedSchema } from "@/server/lib/schema";

export default defineEventHandler(async (event): Promise<InvestmentsList> => {
  const { data, error } = await readValidatedBody(event, (data) => PaginatiedSchema.safeParse(data));
  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }
  const userId = (event.context.user as WebAppUser).id;

  const where = { userId, closed: false };
  const total = await prisma.investment.count({ where });
  const items = await prisma.investment.findMany({
    where,
    orderBy: { finish: "asc" },
    ...pagination(data.pagination),
  });
  return {
    pagination: { ...data.pagination, total },
    items: items.map((i) => ({
      id: Number(i.id),
      amount: Number(i.amount),
      rate: i.rate,
      interest: Number(i.interest),
      start: Number(i.start),
      finish: Number(i.finish),
    })),
  };
});
