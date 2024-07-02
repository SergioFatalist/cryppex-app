<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useAppStore } from "~/stores/app";
import type { WebAppUser } from "~/types";

const router = useRouter();
const $app = useAppStore();
const { $telegram } = useNuxtApp();

//const platform = Telegram.WebApp.platform;
// if (platform == "tdesktop") {
//   await router.push("/use-mobile");
// } else if (platform != "ios" && platform != "android") {
//   navigateTo("https://t.me/cryppex_dev_bot/cryppex_dev_app", { external: true });
// }

const validateHash = async () => {
  const initData = $telegram.WebApp.initData;
  const params = new URLSearchParams(initData);

  if (initData) {
    const { data, error } = await useFetch("/api/user", {
      method: "POST",
      body: { data: JSON.stringify(initData) },
    });

    if (error.value || !data.value?.result) {
      $app.$state.user = undefined;
      $telegram.WebApp.close();
      //await router.push("/no-data");
    }
    $app.$state.user = <WebAppUser>JSON.parse(<string>params.get("user"));
  }

  if (!$app.$state.user) {
    $telegram.WebApp.close();
    // await router.push("/no-data");
  }
};

onMounted(validateHash);
</script>
