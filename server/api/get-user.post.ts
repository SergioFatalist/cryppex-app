import { type User, IdFieldSchema } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<User> => {
  const { data, error } = await readValidatedBody(event, (data) => IdFieldSchema.safeParse(data));

  if (!data || error) {
    console.log(error);
    throw new Error(`Data is missing or ${error}`);
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: data.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      languageCode: true,
      address: true,
      balance: true,
      locked: true,
      interest: true,
      referrerId: true,
      created: true,
    },
  });

  return {
    ...user,
    id: Number(user.id),
    balance: Number(user.balance),
    locked: Number(user.locked),
    interest: Number(user.interest),
    referrerId: Number(user.referrerId),
    created: Number(user.created),
    investsCount: 0,
    investsAmount: 0,
  };
});
