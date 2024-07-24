import { EventType, SendSchema } from "@/server/lib/schema";
import logEvent from "~/server/lib/services/log-event";

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
  const amount = (data.amount - config.public.sendFeeAbsolute) * 1_000_000;
  await logEvent(user.id, EventType.TRX_REQUEST, `to:${data.to} amount:${amount}`);

  if (user && user.balance > data.amount) {
    const trxTX = await tron.trx.send(data.to, amount);
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
