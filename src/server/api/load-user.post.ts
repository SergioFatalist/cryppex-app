import { Prisma } from "@prisma/client";
import { EventType, IdFieldSchema, type User } from "@/server/lib/schema";
import logEvent from "~/server/lib/services/log-event";
import createUser from "@/server/lib/services/create-user";
import updateUser from "@/server/lib/services/update-user";

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
  const u = await prisma.user.findUnique({ where });
  const eventType = u ? EventType.USER_UDPATE : EventType.USER_CREATE;
  const user = u ? await updateUser(webAppUser, u.refId ?? undefined) : await createUser(webAppUser, refId);

  await logEvent(user.id, eventType, `${user.id}:${user.balance}`);

  const info = await prisma.userInfo.findUniqueOrThrow({ where: { id: user.id } });
  return {
    ...info,
    id: Number(info.id),
    address: tron.address.fromHex(info.address),
    balance: parseFloat((Number(info.balance) / 1_000_000).toFixed(2)),
    refId: Number(info.refId),
    created: Number(info.created),
    investsAmount: parseFloat((Number(info.investsAmount) / 1_000_000).toFixed(2)),
    investsCount: Number(info.investsCount),
    investsInterest: parseFloat((Number(info.investsInterest) / 1_000_000).toFixed(2)),
  };
});
