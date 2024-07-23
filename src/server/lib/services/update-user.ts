import { TransactionType } from "@/server/lib/schema";
import listTrxTransactions from "@/server/lib/services/list-trx-transactions";
import updateBonuses from "@/server/lib/services/update-bonuses";

export default async function updateUser(webAppUser: WebAppUser, refId?: number | bigint) {
  const config = useRuntimeConfig();
  let applyBonuses = false;
  let bonus = 0n;
  const user = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: webAppUser.id },
    });
    const lastTx = await tx.transaction.findFirst({
      where: { userId: user.id, success: true },
      orderBy: { txTime: "desc" },
    });
    const data = { balance: user.balance };
    const trxTXs = await listTrxTransactions(user.address, lastTx?.txTime);
    for (const trxTX of trxTXs.data) {
      const t = await prisma.transaction.count({ where: { txID: trxTX.txID } });
      if (t > 0) {
        continue;
      }
      const hex = tron.address.toHex(user.address).toLowerCase();
      for (const p of trxTX.raw_data.contract) {
        if (Object.hasOwn(p.parameter.value, "asset_name") || p.parameter.value.amount < 100_000_000) {
          continue;
        }
        const minus = p.parameter.value.owner_address.toLowerCase() === hex;
        const amount = BigInt(p.parameter.value.amount);
        await tx.transaction.upsert({
          where: { txID: trxTX.txID },
          create: {
            amount: amount,
            success: true,
            txID: trxTX.txID,
            txTime: trxTX.block_timestamp,
            txOwnerAddress: p.parameter.value.owner_address,
            txToAddress: p.parameter.value.to_address,
            type: minus ? TransactionType.WITHDRAWAL : TransactionType.DEPOSIT,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
          update: {},
        });
        data.balance = minus ? data.balance - amount : data.balance + amount;
        applyBonuses = applyBonuses ? applyBonuses : !minus;
        bonus =
          minus && amount < BigInt(100_000_000)
            ? bonus
            : bonus +
              BigInt(Math.round(Number(amount) * parseFloat((config.finance.topBonusPercent / 100).toString())));
      }
    }
    return tx.user.update({ where: { id: user.id }, data });
  });

  if (applyBonuses && refId) {
    await updateBonuses(refId, user.id, bonus);
    return prisma.user.findUniqueOrThrow({ where: { id: user.id } });
  }

  return user;
}
