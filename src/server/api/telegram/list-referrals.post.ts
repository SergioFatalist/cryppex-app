import { type Referrals } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<Referrals> => {
  const refId = (event.context.user as WebAppUser).id;
  const items = await prisma.refInfo.findMany({
    where: { refId },
    orderBy: { created: "desc" },
  });
  return items.map((user) => ({
    ...user,
    id: Number(user.id),
    refId: Number(user.refId),
    created: Number(user.created),
    balance: parseFloat((Number(user.balance) / 1_000_000).toFixed(2)),
    pending: parseFloat((Number(user.pending) / 1_000_000).toFixed(2)),
    applied: parseFloat((Number(user.applied) / 1_000_000).toFixed(2)),
  }));
});
