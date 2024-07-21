export default async function (userId: number | bigint, refId: number | bigint) {
  const where = {
    userId,
    refId,
    applied: false,
  };
  await prisma.$transaction(async (tx) => {
    const bonuses = await tx.bonus.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });
    if (bonuses._sum.amount && bonuses._sum.amount > 0) {
      await tx.bonus.updateMany({
        where,
        data: {
          applied: true,
        },
      });
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          balance: {
            increment: bonuses._sum.amount,
          },
        },
      });
    }
  });
}
