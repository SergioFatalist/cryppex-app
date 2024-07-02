<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
const platform = Telegram.WebApp.platform;
const router = useRouter();

// if (platform == "tdesktop") {
//   await router.push("/use-mobile");
// } else if (platform != "ios" && platform != "android") {
//   navigateTo("https://t.me/cryppex_dev_bot/cryppex_dev_app", { external: true });
// }
/*
user={"id":273459086,"first_name":"Jackson","last_name":"Teller","username":"JaksonTeller","language_code":"ru","allows_write_to_pm":true}
&chat_instance=-3569534240739899598&chat_type=private&auth_date=1719925927&hash=70dddf1364d42a746046067e6fb4551143917431282d518ac910826b5ff2345e


 */
</script>

