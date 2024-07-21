import pagination from "~/server/lib/pagination";
import { PaginatiedSchema, type TransactionsList } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<TransactionsList> => {
  const { data, error } = await readValidatedBody(event, (data) => PaginatiedSchema.safeParse(data));
  const userId = (event.context.user as WebAppUser).id;
  console.log(data);

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  const where = { userId, amount: { gte: 1_000_000 } };
  const total = await prisma.transaction.count({ where });
  const items = await prisma.transaction.findMany({
    where,
    select: {
      id: true,
      txTime: true,
      refId: true,
      amount: true,
      success: true,
      type: true,
    },
    ...pagination(data.pagination),
  });

  return {
    pagination: { ...data.pagination, total },
    items: items.map((t) => ({
      id: Number(t.id),
      refId: Number(t.refId),
      txTime: Number(t.txTime),
      amount: Number(t.amount),
      success: t.success,
      type: t.type,
    })),
  };
});
