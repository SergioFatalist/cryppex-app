import { ApplyInvestSchema, TransactionType } from "~/server/lib/schema";
import dayjs from "dayjs";

const minimals = new Map<number, number>([
  [10, 100_000_000],
  [20, 500_000_000],
  [30, 1000_000_000],
]);

export default defineEventHandler(async (event): Promise<void> => {
  const body = await readRawBody(event);
  console.log("body >>>>>> ", body);

  const { data, error } = await readValidatedBody(event, (data) => ApplyInvestSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }
  const id = (event.context.user as WebAppUser).id;
  const amount = data.amount * 1_000_000;
  const rate = minimals.get(data.rate) ? data.rate : 0;
  const now = dayjs();

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id },
    });
    if (!rate || (minimals.get(rate) ?? 0) > amount || user.balance < amount) {
      throw new Error("Invalid Data specified");
    }
    await tx.investment.create({
      data: {
        amount: amount,
        rate: rate,
        start: now.valueOf(),
        finish: now.add(rate + 10, "day").valueOf(),
        // finish: now.add(1, "minutes").valueOf(),
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
      data: { balance: user.balance - BigInt(amount) },
    });
    await tx.transaction.create({
      data: {
        type: TransactionType.INVEST,
        internal: true,
        success: true,
        pending: false,
        amount,
        txTime: now.valueOf(),
        user: {
          connect: {
            id,
          },
        },
      },
    });
  });
});
