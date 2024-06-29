import { defineStore } from "pinia";

export type Locale = "en" | "ru" | string;

export interface AppState {
  locale: Locale;
  timezone: string;
  format: string;
}

export const useAppStore = defineStore("cryppex-io", {
  state: (): AppState => ({
    locale: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    format: "DD/MM/YYYY HH:mm",
  }),
  persist: {
    storage: persistedState.localStorage,
  },
});
