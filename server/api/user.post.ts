import crypto from "crypto";
import dayjs from "dayjs";
import { H3Event } from "h3";
import { WebAppUser } from "~/types";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  if (!body.data || body.data.length < 10) {
    return {
      result: false,
    };
  }
  const config = useRuntimeConfig();
  const initData = new URLSearchParams(JSON.parse(body.data));
  initData.sort();

  const h = initData.get("hash");
  const u = initData.get("user");

  initData.delete("hash");

  const dataToCheck = [...initData.entries()].map(([key, value]) => key + "=" + value).join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(config.botToken).digest();

  const _hash = crypto.createHmac("sha256", secretKey).update(dataToCheck).digest("hex");

  const result = h === _hash;
  const webAppUser = u ? <WebAppUser>JSON.parse(u ?? "{}") : undefined;

  if (!result || !webAppUser) {
    return { result: false, user: undefined };
  }

  const user = await prisma.user.upsert({
    where: {
      telegramId: webAppUser.id.toString(),
    },
    create: {
      telegramId: webAppUser.id.toString(),
      firstName: webAppUser.first_name,
      lastName: webAppUser.last_name,
      username: webAppUser.username,
      languageCode: webAppUser.language_code,
      loginEpoch: dayjs().unix(),
    },
    update: {
      loginEpoch: dayjs().unix(),
    },
  });

  return { result, user };
});
