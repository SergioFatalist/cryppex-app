import crypto from "crypto";
import getInvestmentsSummary from "~/server/lib/get-investments-summary";
import { InitDataSchema, type UserWithSummary } from "~/server/lib/schema";
import type { TransferContract } from "~/types/contract";
import type { WebAppUser } from "~/types/telegram";
import type { Transaction } from "~/types/transaction";
import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event): Promise<UserWithSummary> => {
  const { data, error } = await readValidatedBody(event, (data) => InitDataSchema.safeParse(data));
  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  const config = useRuntimeConfig();
  const where: Prisma.UserWhereUniqueInput = {
    telegramId: undefined,
    id: undefined,
  };
  let webAppUser: WebAppUser | undefined = undefined;

  if (data.initData && data.initData.length > 30) {
    const initData = new URLSearchParams(JSON.parse(data.initData));
    initData.sort();
    const h = initData.get("hash");
    const u = initData.get("user");

    if (!h || !u) {
      throw new Error("No init DATA");
    }

    webAppUser = JSON.parse(u) as WebAppUser;
    initData.delete("hash");
    const dataToCheck = [...initData.entries()].map(([key, value]) => key + "=" + value).join("\n");
    const secretKey = crypto.createHmac("sha256", "WebAppData").update(config.botToken).digest();
    const hash = crypto.createHmac("sha256", secretKey).update(dataToCheck).digest("hex");

    if (h !== hash) {
      throw new Error("Invalid hash");
    }
    where.telegramId = webAppUser.id;
  } else if (data.userId) {
    where.id = data.userId;
  } else {
    throw new Error("No any DATA");
  }

  const now = new Date().getTime();
  let user = await prisma.user.findUnique({ where });

  if (user) {
    await prisma.$transaction(async (tx) => {
      if (!user) {
        return;
      }
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
  } else if (webAppUser) {
    const account = await tron.createAccount();
    user = await prisma.user.create({
      data: {
        telegramId: webAppUser.id,
        firstName: webAppUser.first_name,
        lastName: webAppUser.last_name,
        username: webAppUser.username,
        languageCode: webAppUser.language_code,
        address: account.address.base58,
        privateKey: account.privateKey,
        created: now,
        referrer: data.kentId
          ? {
              connect: {
                telegramId: BigInt(data.kentId),
              },
            }
          : undefined,
      },
    });
  } else {
    throw new Error("Invalid DATA");
  }

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
      referrerId: user.referrerId,
    },
    summary: await getInvestmentsSummary(user.id),
  };
});
