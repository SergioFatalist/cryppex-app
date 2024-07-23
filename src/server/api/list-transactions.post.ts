import { type TransactionsList } from "@/server/lib/schema";

export default defineEventHandler(async (event): Promise<TransactionsList> => {
  const userId = (event.context.user as WebAppUser).id;

  const items = await prisma.transaction.findMany({
    where: { userId, amount: { gte: 1_000_000 } },
    select: {
      id: true,
      txTime: true,
      refId: true,
      amount: true,
      success: true,
      type: true,
    },
  });

  return items.map((t) => ({
    id: Number(t.id),
    refId: Number(t.refId),
    txTime: Number(t.txTime),
    amount: parseFloat((Number(t.amount) / 1_000_000).toFixed(2)),
    success: t.success,
    type: t.type,
  }));
});
