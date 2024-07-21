import { ApplyInvestSchema } from "~/server/lib/schema";

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

  if (!minimals.get(data.rate) || (minimals.get(data.rate) ?? 0) > data.amount) {
    throw new Error("Invalid Data specified");
  }

  const now = new Date().getTime();
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: data.userId },
    });
    const amount = BigInt(data.amount);
    const balance = user.balance - amount;
    await tx.investment.create({
      data: {
        amount: data.amount,
        rate: data.rate,
        start: now,
        finish: now + 86400000 * data.rate,
        closed: false,
        interest: BigInt(0),
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
    await tx.user.update({
      where: { id: data.userId },
      data: { balance },
    });
  });
});
