import { Prisma } from "@prisma/client";
import crypto from "crypto";
import dayjs from "dayjs";
import { omit } from "remeda";
import {
  InitDataSchema,
  ListRequestSchema,
  User,
  UserSchema,
  UsersList,
  UsersListSchema,
  UserWithSummary,
  UserWithSummarySchema,
  UuidFieldSchema,
} from "~/server/model/trpc";
import { TransferContract } from "~/server/model/types/Contract";
import { Transaction } from "~/server/model/types/Transaction";
import getInvestmentsSummary from "~/server/trpc/handlers/get-investments-summary";
import { procedure, router } from "~/server/trpc/trpc";
import errorParser from "../error-parser";

// const tronUrl =
//   "https://api.trongrid.io/v1/accounts/{ADDRESS_BASE98}/transactions?only_confirmed=true&only_to=true&search_internal=false&min_timestamp={UNIXTIME * 1000}";

export default router({
  set: procedure
    .input(InitDataSchema)
    .output(UserWithSummarySchema)
    .mutation(async ({ input }): Promise<UserWithSummary> => {
      try {
        const config = useRuntimeConfig();
        const initData = new URLSearchParams(JSON.parse(input.initData));
        initData.sort();

        const h = initData.get("hash");
        const u = initData.get("user");

        if (!h || !u) {
          throw new Error("no data");
        }

        initData.delete("hash");

        const dataToCheck = [...initData.entries()].map(([key, value]) => key + "=" + value).join("\n");
        const secretKey = crypto.createHmac("sha256", "WebAppData").update(config.botToken).digest();
        const hash = crypto.createHmac("sha256", secretKey).update(dataToCheck).digest("hex");
        console.error(hash, h);
        if (h !== hash) {
          throw new Error("invalid hash");
        }

        const count = await prisma.user.count({
          where: { telegramId: input.webAppUser.id },
        });

        if (count) {
          const user = await prisma.$transaction(async (tx) => {
            const u = await prisma.user.findUniqueOrThrow({
              where: {
                telegramId: input.webAppUser.id,
              },
            });
            const data: Prisma.UserUpdateInput = {
              lastLoginEpoch: u.currLoginEpoch,
              currLoginEpoch: dayjs().unix(),
              balance: undefined,
            };

            const lastTransaction = await tx.transaction.findFirst({
              where: { userId: u.id },
              orderBy: { startEpoch: "desc" },
            });

            let url = `https://api.trongrid.io/v1/accounts/${u.address}/transactions?only_confirmed=true&only_to=true&search_internal=false`;
            if (lastTransaction) {
              url += `&min_timestamp=${lastTransaction.startEpoch * 1000}`;
            }
            const result = await $fetch<{ data: Transaction<TransferContract>[] }>(url, {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            });

            data.balance = u.balance;
            for (const trxTX of result.data) {
              const hex = tronWeb.address.toHex(u.address).toLowerCase();
              for (const p of trxTX.raw_data.contract) {
                if (p.type.toLowerCase() === "transfercontract" && p.parameter.value.amount > 1000000) {
                  console.dir(trxTX.txID);
                  const exist = await tx.transaction.findUnique({
                    where: { txId: trxTX.txID },
                  });
                  if (!exist && p.parameter.value.to_address.toLowerCase() === hex) {
                    await tx.transaction.create({
                      data: {
                        amount: p.parameter.value.amount,
                        success: true,
                        startEpoch: Math.round(trxTX.raw_data.timestamp / 1000),
                        endEpoch: Math.round(trxTX.raw_data.timestamp / 1000),
                        txId: trxTX.txID,
                        operation: "top-up",
                        user: {
                          connect: {
                            id: u.id,
                          },
                        },
                      },
                    });
                    data.balance = data.balance + BigInt(p.parameter.value.amount);
                  } else if (exist && p.parameter.value.owner_address.toLowerCase() === hex) {
                    await tx.transaction.update({
                      where: { id: exist.id },
                      data: {
                        endEpoch: Math.round(trxTX.raw_data.timestamp / 1000),
                        success: true,
                      },
                    });
                  }
                }
              }
            }
            return tx.user.update({ where: { id: u.id }, data });
          });
          return {
            user: omit(user, ["privateKey"]),
            summary: await getInvestmentsSummary(user.id),
          };
        } else {
          const account = await tronWeb.createAccount();
          let referrerId: string | null = null;
          if (input.kentId) {
            const ref = await prisma.user.findUnique({
              where: {
                telegramId: BigInt(input.kentId),
              },
            });
            if (ref) {
              referrerId = ref.id;
            }
          }

          const user = await prisma.user.create({
            data: {
              telegramId: input.webAppUser.id,
              firstName: input.webAppUser.first_name,
              lastName: input.webAppUser.last_name,
              username: input.webAppUser.username,
              languageCode: input.webAppUser.language_code,
              address: account.address.base58,
              privateKey: account.privateKey,
              currLoginEpoch: dayjs().unix(),
              referrerId,
            },
          });
          return {
            user: omit(user, ["privateKey"]),
            summary: await getInvestmentsSummary(user.id),
          };
        }
      } catch (error) {
        console.error(error);
        throw errorParser(error);
      }
    }),

  get: procedure
    .input(UuidFieldSchema)
    .output(UserSchema)
    .query(async ({ input }): Promise<User> => {
      try {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: input.id,
          },
        });
        return omit(user, ["privateKey"]);
      } catch (error) {
        console.error("Error: ", error);
        throw errorParser(error);
      }
    }),

  list: procedure
    .input(ListRequestSchema)
    .output(UsersListSchema)
    .query(async ({ input }): Promise<UsersList> => {
      try {
        const where = { referrerId: input.userId };
        const total = await prisma.user.count({ where });
        const items = await prisma.user.findMany({
          where,
          ...parsePagination(input.pagination),
        });
        return {
          pagination: { ...input.pagination, total },
          items,
        };
      } catch (error) {
        console.error(error);
        throw errorParser(error);
      }
    }),
});
