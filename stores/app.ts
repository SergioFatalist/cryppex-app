import type { WebAppUser } from "~/types";

export interface AppState {
  user?: WebAppUser | undefined;
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({}),
});
