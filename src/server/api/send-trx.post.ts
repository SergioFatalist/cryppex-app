import { SendSchema } from "@/server/lib/schema";

export default defineEventHandler(async (event): Promise<void> => {
  const { data, error } = await readValidatedBody(event, (data) => SendSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }
  const id = (event.context.user as WebAppUser).id;
  const config = useRuntimeConfig();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  if (user && user.balance > data.amount) {
    const trxTX = await tron.trx.send(data.to, data.amount - config.public.sendFeeAbsolute * 1_000_000);
    if (trxTX.result) {
      user.balance -= BigInt(data.amount);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: user.balance,
        },
      });
    }
  }
});
