import { Prisma } from "@prisma/client";
import { EventType, IdFieldSchema, type User } from "~/server/lib/schema";
import createEvent from "~/server/lib/services/create-event";
import createUser from "~/server/lib/services/create-user";
import type { TransferContract } from "~/types/contract";
import type { Transaction } from "~/types/transaction";

export default defineEventHandler(async (event): Promise<User> => {
  const { data, error } = await readValidatedBody(event, (data) => IdFieldSchema.safeParse(data));
  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }
  const webAppUser = event.context.user as WebAppUser;
  const refId = data.id;

  const where: Prisma.UserWhereUniqueInput = {
    id: webAppUser.id,
  };
  const now = new Date().getTime();
  let user = await prisma.user.findUnique({ where });
  let eventType = EventType.UNDEFINED;

  if (user) {
    eventType = EventType.USER_LOGIN;
    await prisma.$transaction(async (tx) => {
      if (!user) return;
      const data = {
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
  } else {
    eventType = EventType.USER_CREATE;
    user = await createUser(webAppUser, refId);
  }

  await createEvent(
    user.id,
    eventType,
    `${user.id}:${user.username}:${user.firstName}:${user.lastName}:${user.languageCode}`
  );

  if (data.id) {
    await prisma.transaction.create({
      data: {
        userId: data.id,
        refId: user.id,
        type: "bonus:registration",
        txTime: now,
        internal: true,
        amount: 10_000_000,
        success: true,
      },
    });
  }

  const info = await prisma.userInfo.findUniqueOrThrow({ where: { id: user.id } });
  return {
    ...info,
    id: Number(info.id),
    balance: Number(info.balance),
    locked: Number(info.locked),
    refId: Number(info.refId),
    created: Number(info.created),
    investsAmount: Number(info.investsAmount),
    investsCount: Number(info.investsCount),
    investsInterest: Number(info.investsInterest),
  };
});
