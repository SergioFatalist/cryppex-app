import { defineStore } from "pinia";
import type { Investment, InvestmentsList, Pagination, Transaction, TransactionsList, User } from "~/server/lib/schema";

export interface ViewState {
  loading?: boolean;
  pagination?: Pagination;
  filters?: {
    [key: string]: unknown;
  };
  tabs?: {
    [key: string]: unknown;
  };
  visibleColumns?: string[];
  [key: string]: unknown;
}

export interface AppState {
  initData: string;
  user?: User | undefined;
  kentId?: number | undefined;
  transactions?: Transaction[];
  investments?: Investment[];
  viewStates: {
    [name: string]: ViewState;
  };
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({
    initData: "",
    user: undefined,
    viewStates: {},
  }),
  persist: {
    storage: persistedState.sessionStorage,
    paths: ["initData", "viewStates"],
  },
  getters: {
    getUser: (state) => state.user ?? {},
    getViewName(): string {
      const router = useRouter();
      return router.currentRoute.value.path.replace(/\//gi, "-").substring(1);
    },
    getDefaultPagination(): Pagination {
      return {
        page: 1,
        itemsPerPage: 10,
        total: 0,
      };
    },
    getDefaultViewState(): ViewState {
      return <ViewState>{
        loading: false,
        pagination: this.getDefaultPagination,
      };
    },
    getViewState(state): ViewState {
      if (!state.viewStates[this.getViewName]) {
        state.viewStates[this.getViewName] = this.getDefaultViewState;
      }
      return state.viewStates[this.getViewName];
    },
  },
  actions: {
    setInitData(initData: string) {
      if (initData.length < 30) {
        return;
      }
      this.$state.initData = initData;
      const params = new URLSearchParams(initData);
      const startParam = <string | undefined>params.get("start_param");
      this.kentId = startParam && Number.isInteger(parseInt(startParam)) ? parseInt(startParam) : undefined;
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
    setViewState(state: ViewState) {
      this.$state.viewStates[this.getViewName] = state;
    },
    updateViewState(state: ViewState) {
      const current = this.$state.viewStates[this.getViewName] || this.getDefaultViewState;
      this.$state.viewStates[this.getViewName] = {
        ...current,
        ...state,
      };
    },
    clearViewState() {
      this.$state.viewStates[this.getViewName] = this.getDefaultViewState;
    },
    async listTransactions(pagination: Pagination) {
      const data = await $fetch<TransactionsList>("/api/list-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        body: { pagination },
        onRequestError: ({ error }) => console.error(error),
      });
      this.transactions = data.items;
      this.updateViewState({
        loading: false,
        pagination: { ...pagination, total: data.pagination?.total },
      });
    },
    async listInvestments(pagination: Pagination) {
      const data = await $fetch<InvestmentsList>("/api/list-investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        body: { pagination },
        onRequestError: ({ error }) => console.error(error),
      });
      this.investments = data.items;
      this.updateViewState({
        loading: false,
        pagination: { ...pagination, total: data.pagination?.total },
      });
    },
    async sendTrx(to: string, amount: number) {
      await $fetch<TransactionsList>("/api/send-trx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        body: {
          amount: amount * 1_000_000,
          to,
        },
        onRequestError: ({ error }) => console.error(error),
      });
      await this.loadUser();
    },
  },
});
