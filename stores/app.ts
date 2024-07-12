import { defineStore } from "pinia";
import type { InvestmentSummary, User, UserWithSummary } from "~/server/lib/schema";

export interface AppState {
  user?: User | undefined;
  summary: InvestmentSummary;
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({
    user: undefined,
    summary: {
      balance: 0,
      count: 0,
      amount: 0,
      interest: 0,
    },
  }),
  persist: {
    storage: persistedState.sessionStorage,
  },
  getters: {
    getUser: (state) => state.user ?? {},
  },
  actions: {
    setUser(userWithSummary: UserWithSummary) {
      this.$state.user = userWithSummary.user;
      this.$state.summary = userWithSummary.summary;
    },
  },
});
