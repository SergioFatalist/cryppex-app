import type { Telegram } from "~/types/telegram";

export default defineNuxtPlugin({
  name: "telegram",
  async setup() {
    const w = window as unknown as Window & { Telegram: Telegram };
    const telegram = w.Telegram;
    return {
      provide: {
        telegram,
      },
    };
  },
});
