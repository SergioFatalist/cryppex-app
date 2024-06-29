import enUS from "@/i18n/en-US.json";
import ruRU from "@/i18n/ru-RU.json";
import { en, ru } from "vuetify/locale";

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  fallbackLocale: "en-US",
  messages: {
    "en-US": {
      ...enUS,
      $vuetify: en,
    },
    "ru-RU": {
      ...ruRU,
      $vuetify: ru,
    },
  },
}));
