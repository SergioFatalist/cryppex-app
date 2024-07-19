import { validate } from "@telegram-apps/init-data-node";

export default defineEventHandler((event) => {
  if (event.path.startsWith("/api")) {
    const config = useRuntimeConfig();
    const initData = event.headers.get("Telegram-Init-Data");
    if (!initData) {
      throw new Error("NO DATA");
    }
    validate(initData, config.botToken);

    event.context.user = JSON.parse(<string>new URLSearchParams(initData).get("user")) as WebAppUser;
  }
});
