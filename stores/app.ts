import type { InvestmentSummary, User, UserWithSummary } from "~/server/model/trpc";

export interface AppState {
  user?: User | undefined;
  summary: InvestmentSummary;
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({
    user: undefined,
    summary: {
      balance: BigInt(0),
      count: 0,
      amount: BigInt(0),
      interest: BigInt(0),
    },
  }),
  persist: {
    debug: true,
    storage: persistedState.localStorage,
  },
  actions: {
    setUser(userWithSummary: UserWithSummary) {
      this.$state.user = userWithSummary.user;
      this.$state.summary = userWithSummary.summary;
    },
  },
});
