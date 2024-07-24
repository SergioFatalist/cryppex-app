import { EventType } from "~/server/lib/schema";

export default async function createEvent(
  userId: number | bigint,
  eventType: EventType,
  eventText?: string
): Promise<void> {
  await prisma.event.create({
    data: {
      userId,
      eventType,
      eventText,
      eventTime: new Date().getTime(),
    },
  });
}
