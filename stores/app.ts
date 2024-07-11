import { defineStore } from "pinia";
import superjson from "superjson";
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
    storage: persistedState.sessionStorage,
    serializer: {
      serialize: (v) => superjson.stringify(v),
      deserialize: (v) => superjson.parse(v),
    },
  },
  actions: {
    setUser(userWithSummary: UserWithSummary) {
      this.$state.user = userWithSummary.user;
      this.$state.summary = userWithSummary.summary;
    },
  },
});
