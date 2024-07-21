import { TransactionType } from "@/server/lib/schema";

export default async function (userId: number | bigint, refId: number | bigint, bonus: number | bigint) {
  const where = {
    userId,
    refId,
    applied: false,
  };
  let amount = BigInt(bonus);
  await prisma.$transaction(async (tx) => {
    const bonuses = await tx.bonus.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });
    if (bonuses._sum.amount && bonuses._sum.amount > 0) {
      amount += bonuses._sum.amount;
      await tx.bonus.updateMany({
        where,
        data: {
          applied: true,
        },
      });
    }
    if (amount > 0) {
      await tx.transaction.create({
        data: {
          userId,
          refId,
          txTime: new Date().getTime(),
          type: TransactionType.BONUS,
          amount,
          success: true,
          internal: true,
        },
      });
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    }
  });
}
