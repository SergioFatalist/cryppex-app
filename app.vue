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
import { useWebApp, useWebAppViewport } from "vue-tg";
import type { UserWithSummary } from "~/server/lib/schema";

const router = useRouter();
const $app = useAppStore();
const $config = useRuntimeConfig();

const wa = useWebApp();
const waViewport = useWebAppViewport();

const platform = wa.platform;
const mobile = ref<boolean>(true || platform == "ios" || platform == "android" || platform == "android_x");

const params = new URLSearchParams(wa.initData);
const startParam = <string | undefined>params.get("start_param");

if (platform !== "unknown" && !mobile.value) {
  await router.push(`/use-mobile?start_param=${startParam}`);
} else if (!mobile.value) {
  navigateTo($config.public.appUrl, { external: true });
}

const setUser = async () => {
  if ((!wa.initData || wa.initData.length < 30) && !$app.$state.user) {
    await router.push("/no-data");
    return;
  }
  waViewport.expand();

  const data = await $fetch<UserWithSummary>("/api/init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      TG: wa.initData,
    },
    body: {
      initData: JSON.stringify(wa.initData),
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
