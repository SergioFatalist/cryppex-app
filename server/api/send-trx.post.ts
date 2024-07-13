import { SendSchema } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<void> => {
  const { data, error } = await readValidatedBody(event, (data) => SendSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: data.userId },
  });

  if (user && user.balance > data.amount) {
    const trxTX = await tron.trx.send(data.to, data.amount);
    if (trxTX.result) {
      user.balance -= BigInt(data.amount);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: user.currLogin,
          currLogin: new Date().getTime(),
          balance: user.balance,
        },
      });
    }
  }
});
