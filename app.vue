<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
const platform = Telegram.WebApp.platform;
const router = useRouter();

if (platform == "tdesktop") {
  await router.push("/use-mobile");
} else if (platform != "ios" && platform != "android") {
  navigateTo("https://t.me/cryppex_dev_bot/cryppex_dev_app", { external: true });
}
</script>
