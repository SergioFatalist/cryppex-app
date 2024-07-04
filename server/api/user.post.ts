import crypto from "crypto";
import dayjs from "dayjs";
import { H3Event } from "h3";
import { WebAppUser } from "~/types/telegram";

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

  let user = await prisma.user.findUnique({
    where: {
      telegramId: webAppUser.id,
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId: webAppUser.id,
        firstName: webAppUser.first_name,
        lastName: webAppUser.last_name,
        username: webAppUser.username,
        languageCode: webAppUser.language_code,
        currLoginEpoch: dayjs().unix(),
      },
    });
  } else {
    user = await prisma.user.update({
      where: {
        telegramId: webAppUser.id,
      },
      data: {
        lastLoginEpoch: user.currLoginEpoch,
        currLoginEpoch: dayjs().unix(),
      },
    });
  }

  return { result, user };
});
