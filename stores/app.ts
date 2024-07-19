import { defineStore } from "pinia";
import type { User } from "~/server/lib/schema";

export interface AppState {
  initData: string;
  user?: User | undefined;
  kentId?: number | undefined;
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({
    initData: "",
    user: undefined,
  }),
  persist: {
    storage: persistedState.sessionStorage,
  },
  getters: {
    getUser: (state) => state.user ?? {},
  },
  actions: {
    setInitData(initData: string) {
      if (initData.length < 30) {
        return;
      }
      this.$state.initData = initData;
      const params = new URLSearchParams(initData);
      const startParam = <string | undefined>params.get("start_param");
      this.kentId = startParam && Number.isInteger(parseInt(startParam)) ? parseInt(startParam) : undefined
    },
    async loadUser() {
      this.$state.user = await $fetch<User>("/api/load-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.$state.initData,
        },
        body: {
          kentId: this.$state.kentId,
        },
        onRequestError: ({ error }) => console.error(error),
      });
    },
  },
});
