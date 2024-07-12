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
    ...pagination(data.pagination),
  });
  return {
    pagination: { ...data.pagination, total },
    items: items.map((user) => ({
      ...omit(user, ["privateKey"]),
      telegramId: Number(user.telegramId),
      balance: Number(user.balance),
      locked: Number(user.locked),
      interest: Number(user.interest),
      created: Number(user.created),
      currLogin: user.currLogin ? Number(user.currLogin) : undefined,
      lastLogin: user.lastLogin ? Number(user.lastLogin) : undefined,
    })),
  };
});
