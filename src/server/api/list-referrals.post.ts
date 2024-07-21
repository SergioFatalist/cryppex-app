import pagination from "@/server/lib/pagination";
import { PaginatiedSchema, type Referrals } from "@/server/lib/schema";

export default defineEventHandler(async (event): Promise<Referrals> => {
  const { data, error } = await readValidatedBody(event, (data) => PaginatiedSchema.safeParse(data));
  const refId = (event.context.user as WebAppUser).id;

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  const where = { refId };
  const total = await prisma.user.count({ where });
  const items = await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      balance: true,
      created: true,
    },
    ...pagination(data.pagination),
  });
  return {
    pagination: { ...data.pagination, total },
    items: items.map((user) => ({
      ...user,
      id: Number(user.id),
      balance: Number(user.balance),
      created: Number(user.created),
    })),
  };
});
