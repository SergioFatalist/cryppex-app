import { defineStore } from "pinia";
import type {
  Investment,
  InvestmentsList,
  RefUser,
  Referrals,
  Transaction,
  TransactionsList,
  User,
} from "~/server/lib/schema";

export interface AppState {
  initData: string;
  loading: boolean;
  lang: string;
  user?: User | undefined;
  kentId?: number | undefined;
  transactions?: Transaction[];
  investments?: Investment[];
  referrer?: RefUser;
  referrals?: RefUser[];
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({
    initData: "",
    lang: "en",
    loading: false,
    user: undefined,
  }),
  persist: {
    storage: persistedState.sessionStorage,
    paths: ["initData", "lang"],
  },
  getters: {
    getUser: (state) => state.user ?? {},
  },
  actions: {
    setInitData(initData: string, lang: string) {
      if (initData.length < 30) {
        return;
      }
      this.initData = initData;
      this.lang = lang;
      const params = new URLSearchParams(initData);
      const startParam = <string | undefined>params.get("start_param");
      this.kentId = startParam && Number.isInteger(parseInt(startParam)) ? parseInt(startParam) : undefined;
    },
    async loadUser() {
      this.loading = true;
      this.user = await $fetch<User>("/api/load-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        body: {
          id: this.kentId,
        },
        onRequestError: this.onRequestError,
      });
      this.loading = false;
    },
    async sendTrx(to: string, amount: number) {
      this.loading = true;
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
      this.loading = false;
    },
    async listTransactions() {
      this.loading = true;
      this.transactions = await $fetch<TransactionsList>("/api/list-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        onRequestError: this.onRequestError,
      });
      this.loading = false;
    },
    async invest(rate: number, amount: number) {
      this.loading = true;
      await $fetch("/api/invest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        body: {
          rate: parseInt(rate.toString()),
          amount: parseInt(amount.toString()),
        },
        onRequestError: this.onRequestError,
      });
      await this.loadUser();
      this.loading = false;
    },
    async listInvestments() {
      this.loading = true;
      this.investments = await $fetch<InvestmentsList>("/api/list-investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        onRequestError: this.onRequestError,
      });
      this.loading = false;
    },
    async listReferrals() {
      this.loading = true;
      this.referrals = await $fetch<Referrals>("/api/list-referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        onRequestError: this.onRequestError,
      });
      this.loading = false;
    },
    onRequestError: ({ error }: { error: Error }) => console.error(error),
  },
});
