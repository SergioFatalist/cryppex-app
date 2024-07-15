<template>
  <v-layout>
    <v-main>
      <NuxtPage />
    </v-main>
    <v-bottom-navigation v-if="mobile">
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

const platform = $telegram.WebApp.platform;
const mobile = ref<boolean>(platform == "ios" || platform == "android");

const initData = $telegram.WebApp.initData;
const params = new URLSearchParams(initData);
const startParam = <string | undefined>params.get("start_param");

if (platform !== "unknown" && !mobile.value) {
  await router.push(`/use-mobile?start_param=${startParam}`);
} else if (!mobile.value) {
  navigateTo($config.public.appUrl, { external: true });
}

const setUser = async () => {
  if ((!initData || initData.length < 30) && !$app.$state.user) {
    await router.push("/no-data");
    return;
  }
  $telegram.WebApp.expand();

  const data = await $fetch<UserWithSummary>("/api/init", {
    method: "POST",
    body: {
      initData: JSON.stringify(initData),
      userId: $app.$state.user?.id,
      kentId: startParam && Number.isInteger(parseInt(startParam)) ? parseInt(startParam) : undefined,
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
