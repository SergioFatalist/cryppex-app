import type { User } from "~/server/model/trpc";

export interface AppState {
  user?: User | undefined;
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({
    user: undefined,
  }),
  persist: {
    debug: true,
    storage: persistedState.localStorage,
  },
  actions: {
    setUser(user: User) {
      this.$state.user = user;
    },
  },
});
