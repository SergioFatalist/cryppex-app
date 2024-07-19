import type { Telegram } from "@twa-dev/types";

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
