import { ApplyInvestSchema } from "@/server/lib/schema";

const minimals = new Map<number, number>([
  [10, 100_000_000],
  [20, 500_000_000],
  [30, 1000_000_000],
]);

export default defineEventHandler(async (event): Promise<void> => {
  const { data, error } = await readValidatedBody(event, (data) => ApplyInvestSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }
  const id = (event.context.user as WebAppUser).id;
  const amount = data.amount * 1_000_000;
  const rate = minimals.get(data.rate) ? data.rate : 0;

  if (!rate || (minimals.get(rate) ?? 0) > amount) {
    throw new Error("Invalid Data specified");
  }

  const now = new Date().getTime();
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id },
    });
    const amount = BigInt(data.amount * 1_000_000);
    const balance = user.balance - amount;
    await tx.investment.create({
      data: {
        amount: amount,
        rate: rate,
        start: now,
        finish: now + 86400000 * rate,
        closed: false,
        interest: BigInt(0),
        user: {
          connect: {
            id,
          },
        },
      },
    });
    await tx.user.update({
      where: { id },
      data: { balance },
    });
  });
});
