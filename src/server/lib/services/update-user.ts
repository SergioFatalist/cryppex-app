import { TransactionType } from "@/server/lib/schema";
import listTrxTransactions from "@/server/lib/services/list-trx-transactions";
import updateBonuses from "@/server/lib/services/update-bonuses";

export default async function updateUser(webAppUser: WebAppUser, refId?: number | bigint) {
  const config = useRuntimeConfig();
  let applyBonuses = false;
  let bonus = BigInt(0);
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
      for (const p of trxTX.raw_data.contract) {
        const minus = p.parameter.value.owner_address.toLowerCase() === user.address.toLowerCase();
        const fee = trxTX.ret.reduce((acc, item) => acc + item.fee, 0);
        const amount = BigInt(Math.round(p.parameter.value.amount / 1000) * 1000 + (minus ? fee : 0));

        if (Object.hasOwn(p.parameter.value, "asset_name") || amount < BigInt(100_000_000)) {
          continue;
        }

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
          minus || amount < BigInt(100_000_000)
            ? bonus
            : bonus + BigInt(Math.round(Number(amount) * parseFloat((config.public.topBonusPercent / 100).toString())));
        console.log(`Amount: ${amount} Bonuse: ${bonus}`);
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
