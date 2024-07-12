import pagination from "~/server/lib/pagination";
import { ListRequestSchema, type TransactionsList } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<TransactionsList> => {
  const { data, error } = await readValidatedBody(event, (data) => ListRequestSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  const where = { userId: data.userId, amount: { gte: 1_000_000 } };
  const total = await prisma.transaction.count({ where });
  const items = await prisma.transaction.findMany({
    where,
    select: {
      id: true,
      txTime: true,
      referral: true,
      amount: true,
      success: true,
      type: true,
    },
    ...pagination(data.pagination),
  });

  return {
    pagination: { ...data.pagination, total },
    items: items.map((t) => ({
      ...t,
      amount: Number(t.amount),
      txTime: Number(t.txTime),
    })),
  };
});
