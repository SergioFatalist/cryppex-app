<template>
  <v-layout>
    <v-main>
      <NuxtPage />
    </v-main>
    <v-bottom-navigation>
      <v-btn to="/">
        <v-icon>mdi-home-outline</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn to="/wallet">
        <v-icon>mdi-wallet-outline</v-icon>
        <span>Wallet</span>
      </v-btn>
      <v-btn to="/investment">
        <v-icon>mdi-currency-usd</v-icon>
        <span>Invest</span>
      </v-btn>
      <v-btn to="/friends">
        <v-icon>mdi-account-multiple-outline</v-icon>
        <span>Friends</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script setup lang="ts">
import type { UserWithSummary } from "~/server/lib/schema";

const router = useRouter();
const $app = useAppStore();
const $config = useRuntimeConfig();
const { $telegram } = useNuxtApp();

// const platform = $telegram.WebApp.platform;
// if (platform == "tdesktop") {
//   await router.push("/use-mobile");
// } else if (platform != "ios" && platform != "android") {
//   navigateTo($config.public.appUrl, { external: true });
// }

// const potap =
//   "user=%7B%22id%22%3A5288550634%2C%22first_name%22%3A%22Potap%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22SergioPotap%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-1260992627038743562&chat_type=private&auth_date=1719972346&hash=8b3b8b12361475d3951de90d327a341b19c0368d912fcdd85c5c75ef0474035d";

const setUser = async () => {
  const initData = $telegram.WebApp.initData;
  // const initData = potap;
  if (!initData || initData.length < 30) {
    await router.push("/no-data");
    return;
  }
  const params = new URLSearchParams(initData);
  const startParam = <string | undefined>params.get("start_param");
  const kentId = startParam ? parseInt(startParam) : undefined;

  $telegram.WebApp.expand();
  const data = await $fetch<UserWithSummary>("/api/init", {
    method: "POST",
    body: {
      initData: JSON.stringify(initData),
      webAppUser: JSON.parse(<string>params.get("user")),
      kentId: Number.isInteger(kentId) ? kentId : undefined,
    },
    onRequestError: ({ error }) => console.error(error),
  });
  if (!data) {
    await router.push("/no-data");
    return;
  }
  $app.setUser(data);
};

onBeforeMount(setUser);
</script>
