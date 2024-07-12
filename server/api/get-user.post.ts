import { omit } from "remeda";
import { type User, UuidFieldSchema } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<User> => {
  const { data, error } = await readValidatedBody(event, (data) => UuidFieldSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }
  const user = await prisma.user.findUniqueOrThrow({ where: { id: data.id } });

  return {
    ...omit(user, ["privateKey"]),
    telegramId: Number(user.telegramId),
    balance: Number(user.balance),
    locked: Number(user.locked),
    interest: Number(user.interest),
    created: Number(user.created),
    currLogin: user.currLogin ? Number(user.currLogin) : undefined,
    lastLogin: user.lastLogin ? Number(user.lastLogin) : undefined,
  };
});
