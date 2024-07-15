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

let initData = $telegram.WebApp.initData;
const params = new URLSearchParams(initData);
const startParam = <string | undefined>params.get("start_param");

if (platform !== "unknown" && !mobile.value) {
  await router.push(`/use-mobile?start_param=${startParam}`);
} else if (!mobile.value) {
  navigateTo($config.public.appUrl, { external: true });
}

const setUser = async () => {
  if (!$app.$state.user) {
    if (!initData || initData.length < 30) {
      await router.push("/no-data");
      return;
    }
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
  } else {
    const data = await $fetch<UserWithSummary>("/api/load", {
      method: "POST",
      body: {
        id: $app.$state.user.id,
      },
      onRequestError: ({ error }) => console.error(error),
    });
    $telegram.WebApp.expand();
    if (!data) {
      await router.push("/no-data");
      return;
    }
    $app.setUser(data);
  }
};

onBeforeMount(setUser);
</script>
