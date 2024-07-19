import { defineStore } from "pinia";
import type { User } from "~/server/lib/schema";

export interface AppState {
  initData: string;
  user?: User | undefined;
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
});
