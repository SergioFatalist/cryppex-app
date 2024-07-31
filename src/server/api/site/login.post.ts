import dayjs from "dayjs";
import { type AddressAccount, AddressSchema } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<AddressAccount> => {
  const { data, error } = await readValidatedBody(event, (data) => AddressSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  let user = await prisma.account.findFirst({
    where: { id: data.id },
  });

  if (!user) {
    const account = await tron.createAccount();
    user = await prisma.account.create({
      data: {
        id: data.id,
        address: account.address.hex,
        privateKey: account.privateKey,
        lastLogin: dayjs().unix(),
        lastCounter: 0,
      },
    });
  } else {
    user = await prisma.account.update({
      where: { id: data.id },
      data: {
        lastCounter: {
          increment: (dayjs().unix() - user.lastLogin) * 3,
        },
      },
    });
  }

  return {
    id: user.id,
    address: user.address,
    counter: user.lastCounter.toString(),
  };
});
