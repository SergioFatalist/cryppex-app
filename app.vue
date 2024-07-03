<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useAppStore } from "~/stores/app";

const router = useRouter();
const $app = useAppStore();

//const platform = Telegram.WebApp.platform;
// if (platform == "tdesktop") {
//   await router.push("/use-mobile");
// } else if (platform != "ios" && platform != "android") {
//   navigateTo("https://t.me/cryppex_dev_bot/cryppex_dev_app", { external: true });
// }

const potap =
  "user=%7B%22id%22%3A5288550634%2C%22first_name%22%3A%22Potap%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22SergioPotap%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-1260992627038743562&chat_type=private&auth_date=1719972346&hash=8b3b8b12361475d3951de90d327a341b19c0368d912fcdd85c5c75ef0474035d";

const setUser = async () => {
  const { $client } = useNuxtApp();
  //const initData = $telegram.WebApp.initData;
  const initData = potap;
  console.log(initData);
  const params = new URLSearchParams(initData);

  // if (!initData) {
  //   await router.push("/no-data");
  // }
  try {
    const webAppUser = JSON.parse(<string>params.get("user"), (_k, _v) => (_k == "id" ? BigInt(_v) : _v));
    console.log("webAppUser", webAppUser);
    const result = await $client.User.set.mutate({
      initData: JSON.stringify(initData),
      webAppUser,
    });
    console.log(result);
    $app.$state.user = result;
  } catch (error) {
    console.error(error);
    await router.push("/no-data");
  }

  // $app.$state.user = <WebAppUser>{
  //   id: 273459086,
  //   first_name: "Jackson",
  //   last_name: "Teller",
  //   username: "JaksonTeller",
  //   language_code: "ru",
  //   allows_write_to_pm: true,
  // };
};

onMounted(setUser);
</script>
