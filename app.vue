<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useWebApp, useWebAppViewport } from "vue-tg";

const router = useRouter();
const app = useAppStore();
const config = useRuntimeConfig();
const webApp = useWebApp();

if (!webApp.platform || webApp.platform === "unknown") {
  navigateTo(config.public.appUrl, { external: true });
}

app.setInitData(webApp.initData);
if (app.initData.length < 30) {
  await router.push("/no-data");
}
useWebAppViewport().expand();
await app.loadUser();
</script>
