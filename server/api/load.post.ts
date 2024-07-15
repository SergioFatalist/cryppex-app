import getInvestmentsSummary from "~/server/lib/get-investments-summary";
import { type UserWithSummary, UuidFieldSchema } from "~/server/lib/schema";
import type { TransferContract } from "~/types/contract";
import type { Transaction } from "~/types/transaction";

export default defineEventHandler(async (event): Promise<UserWithSummary> => {
  const { data, error } = await readValidatedBody(event, (data) => UuidFieldSchema.safeParse(data));
  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  let user = await prisma.user.findUniqueOrThrow({
    where: { id: data.id },
  });
  const now = new Date().getTime();

  await prisma.$transaction(async (tx) => {
    const data = {
      lastLogin: user.currLogin,
      currLogin: now,
      balance: user.balance,
    };

    const lastTransaction = await tx.transaction.findFirst({
      where: { userId: user.id, success: true },
      orderBy: { txTime: "desc" },
    });

    let url = `https://api.trongrid.io/v1/accounts/${user.address}/transactions?order_by=block_timestamp%2Casc&only_confirmed=true&search_internal=false`;
    if (lastTransaction) {
      url += `&min_timestamp=${lastTransaction.txTime}`;
    }
    const result = await $fetch<{ data: Transaction<TransferContract>[] }>(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    for (const trxTX of result.data) {
      const t = await prisma.transaction.count({ where: { txID: trxTX.txID } });
      if (t > 0) {
        continue;
      }
      const hex = tron.address.toHex(user.address).toLowerCase();
      for (const p of trxTX.raw_data.contract) {
        const minus = p.parameter.value.owner_address.toLowerCase() === hex;
        const fee = trxTX.ret.reduce((acc, item) => acc + item.fee, 0);
        const amount =
          (p.parameter.value.amount ? BigInt(p.parameter.value.amount) : BigInt(0)) + BigInt(minus ? fee : 0);
        await tx.transaction.upsert({
          where: { txID: trxTX.txID },
          create: {
            amount: amount,
            success: true,
            txID: trxTX.txID,
            txTime: trxTX.block_timestamp,
            txOwnerAddress: p.parameter.value.owner_address,
            txToAddress: p.parameter.value.to_address,
            type: minus ? "withdraw" : "top-up",
            user: {
              connect: {
                id: user.id,
              },
            },
          },
          update: {},
        });
        data.balance = minus ? data.balance - amount : data.balance + amount;
      }
    }
    user = await tx.user.update({ where: { id: user.id }, data });
  });
  return {
    user: {
      id: user.id,
      telegramId: Number(user.telegramId),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      languageCode: user.languageCode,
      address: user.address,
      balance: Number(user.balance),
      locked: Number(user.locked),
      interest: Number(user.interest),
      created: Number(user.created),
    },
    summary: await getInvestmentsSummary(user.id),
  };
});
