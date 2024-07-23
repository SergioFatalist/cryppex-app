import { type Referrals } from "@/server/lib/schema";

export default defineEventHandler(async (event): Promise<Referrals> => {
  const refId = (event.context.user as WebAppUser).id;
  const items = await prisma.refInfo.findMany({
    where: { refId },
    orderBy: { created: "desc" }
  });
  return items.map((user) => ({
    ...user,
    id: Number(user.id),
    refId: Number(user.refId),
    balance: Number(user.balance),
    created: Number(user.created),
    pending: Number(user.pending),
    applied: Number(user.applied),
  }));
});
