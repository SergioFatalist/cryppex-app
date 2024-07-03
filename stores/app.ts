import type { User } from "~/types/app";

export interface AppState {
  user?: User | undefined;
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({}),
});
