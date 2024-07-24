import enUS from "@/i18n/en-US.json";
import ruRU from "@/i18n/ru-RU.json";
import { en, ru } from "vuetify/locale";

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  fallbackLocale: "en",
  messages: {
    en: {
      ...enUS,
      $vuetify: en,
    },
    ru: {
      ...ruRU,
      $vuetify: ru,
    },
  },
}));
