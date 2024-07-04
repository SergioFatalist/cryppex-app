import type { User } from "~/server/model/trpc";

export interface AppState {
  user?: User | undefined;
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({
    user: undefined,
  }),
  actions: {
    setUser(user: User) {
      this.$state.user = user;
    },
  },
});
