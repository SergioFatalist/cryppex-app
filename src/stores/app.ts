import { defineStore } from "pinia";
import type {
  Investment,
  InvestmentsList,
  Pagination,
  RefUser,
  Referrals,
  Transaction,
  TransactionsList,
  User,
} from "@/server/lib/schema";

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
  referrer?: RefUser;
  referrals?: RefUser[];
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
    updateViewState(state: ViewState) {
      const current = this.$state.viewStates[this.getViewName] || this.getDefaultViewState;
      this.$state.viewStates[this.getViewName] = {
        ...current,
        ...state,
      };
    },
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
        onRequestError: this.onRequestError,
      });
    },
    async getReferrer() {
      this.referrer = await $fetch<RefUser>("/api/get-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.$state.initData,
        },
        onRequestError: this.onRequestError,
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
        onRequestError: this.onRequestError,
      });
      await this.loadUser();
    },
    async listTransactions(pagination: Pagination) {
      const data = await $fetch<TransactionsList>("/api/list-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        body: { pagination },
        onRequestError: this.onRequestError,
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
        onRequestError: this.onRequestError,
      });
      this.investments = data.items;
      this.updateViewState({
        loading: false,
        pagination: { ...pagination, total: data.pagination?.total },
      });
    },
    async listReferrals(pagination: Pagination) {
      const data = await $fetch<Referrals>("/api/list-investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        body: { pagination },
        onRequestError: this.onRequestError,
      });
      this.referrals = data.items;
      this.updateViewState({
        loading: false,
        pagination: { ...pagination, total: data.pagination?.total },
      });
    },
    onRequestError: ({ error }: { error: Error }) => console.error(error),
  },
});
