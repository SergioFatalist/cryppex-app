import pagination from "@/server/lib/pagination";
import { PaginatiedSchema, type Referrals } from "@/server/lib/schema";

export default defineEventHandler(async (event): Promise<Referrals> => {
  const { data, error } = await readValidatedBody(event, (data) => PaginatiedSchema.safeParse(data));
  const refId = (event.context.user as WebAppUser).id;

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  const where = { refId };
  const total = await prisma.refInfo.count({ where: { refId: refId } });
  const items = await prisma.refInfo.findMany({
    where,
    ...pagination(data.pagination),
  });
  return {
    pagination: { ...data.pagination, total },
    items: items.map((user) => ({
      ...user,
      id: Number(user.id),
      refId: Number(user.refId),
      balance: Number(user.balance),
      created: Number(user.created),
      pending: Number(user.pending),
      applied: Number(user.applied),
    })),
  };
});
