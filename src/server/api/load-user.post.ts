import { Prisma } from "@prisma/client";
import { EventType, IdFieldSchema, type User } from "@/server/lib/schema";
import createEvent from "@/server/lib/services/create-event";
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
  const count = await prisma.user.count({ where });
  const eventType = count ? EventType.USER_UDPATE : EventType.USER_CREATE;
  const user = count ? await updateUser(webAppUser, refId) : await createUser(webAppUser, refId);

  await createEvent(
    user.id,
    eventType,
    `${user.id}:${user.username}:${user.firstName}:${user.lastName}:${user.languageCode}:${user.balance}`
  );

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
