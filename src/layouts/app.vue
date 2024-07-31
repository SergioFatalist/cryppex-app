<template>
  <v-layout>
    <v-main>
      <NuxtPage />
    </v-main>
    <v-bottom-navigation>
      <v-btn to="/app">
        <v-icon>mdi-home-outline</v-icon>
        <span>{{ $t("Home") }}</span>
      </v-btn>
      <v-btn to="/app/wallet">
        <v-icon>mdi-wallet-outline</v-icon>
        <span>{{ $t("Wallet") }}</span>
      </v-btn>
      <v-btn to="/app/friends">
        <v-icon>mdi-account-multiple-outline</v-icon>
        <span>{{ $t("Friends") }}</span>
      </v-btn>
      <v-btn to="/app/investment">
        <v-icon>mdi-currency-usd</v-icon>
        <span>{{ $t("Interests") }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
<script setup lang="ts">
import { useWebApp, useWebAppViewport, useWebAppTheme } from "vue-tg";

const router = useRouter();
const app = useAppStore();
const config = useRuntimeConfig();
const theme = useTheme();
const webApp = useWebApp();
const $i18n = useI18n();

theme.global.name.value = useWebAppTheme().colorScheme.value;

if (!webApp.platform || webApp.platform === "unknown") {
  navigateTo(config.public.appUrl, { external: true });
}

app.setInitData(webApp.initData, webApp.initDataUnsafe.user?.language_code || "en");
$i18n.locale.value = webApp.initDataUnsafe.user?.language_code || app.lang;

if (app.initData.length < 30) {
  await router.push("/no-data");
}

useWebAppViewport().expand();
await app.loadUser();
</script>
