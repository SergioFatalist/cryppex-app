import { defineStore } from "pinia";
import {
  type Investment,
  type InvestmentsList,
  type RefUser,
  type Referrals,
  type Transaction,
  type TransactionsList,
  type User,
  type AddressAccount,
} from "~/server/lib/schema";

export type Lang = "en" | "ru" | string;

export interface AppState {
  initData: string;
  loading: boolean;
  lang: string;
  dark: boolean;
  user?: User | undefined;
  kentId?: number | undefined;
  transactions?: Transaction[];
  investments?: Investment[];
  referrer?: RefUser;
  referrals?: RefUser[];
  login?: string;
  address?: string;
  counter: number;
  counter2: number;
}

export const useAppStore = defineStore("cryppex", {
  state: (): AppState => ({
    initData: "",
    lang: "en",
    dark: true,
    loading: false,
    user: undefined,
    login: "",
    counter: 1_000_000,
    counter2: 1_000_000,
  }),
  persist: {
    storage: persistedState.sessionStorage,
    paths: ["initData", "lang"],
  },
  getters: {
    getUser: (state) => state.user ?? {},
  },
  actions: {
    onRequestError: ({ error }: { error: Error }) => console.error(error),
    toggleDark() {
      this.dark = !this.dark;
    },
    setLang(lang: Lang) {
      this.lang = lang;
    },
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
      this.user = await $fetch<User>("/api/telegram/load-user", {
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
      await $fetch<TransactionsList>("/api/telegram/send-trx", {
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
      this.transactions = await $fetch<TransactionsList>("/api/telegram/list-transactions", {
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
      await $fetch("/api/telegram/invest", {
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
      this.investments = await $fetch<InvestmentsList>("/api/telegram/list-investments", {
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
      this.referrals = await $fetch<Referrals>("/api/telegram/list-referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Telegram-Init-Data": this.initData,
        },
        onRequestError: this.onRequestError,
      });
      this.loading = false;
    },
    async siteLogin() {
      const res = await $fetch<AddressAccount>("/api/site/login", {
        method: "POST",
        body: {
          id: this.login,
        },
      });
      this.counter = this.counter2 = Number(res.counter);
      this.address = res.address;
    },
    siteLogout() {
      this.counter = this.counter2 = 1_000_000;
      this.address = this.login = undefined;
    },
  },
});
