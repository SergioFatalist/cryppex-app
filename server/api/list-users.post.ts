import { omit } from "remeda";
import pagination from "~/server/lib/pagination";
import { ListRequestSchema, type UsersList } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<UsersList> => {
  const { data, error } = await readValidatedBody(event, (data) => ListRequestSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  const where = { referrerId: data.userId };
  const total = await prisma.user.count({ where });
  const items = await prisma.user.findMany({
    where,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      balance: true,
    },
    ...pagination(data.pagination),
  });
  return {
    pagination: { ...data.pagination, total },
    items: items.map((user) => ({
      ...user,
      id: Number(user.id),
      balance: Number(user.balance),
    })),
  };
});
