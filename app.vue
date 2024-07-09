<template>
  <div v-if="$app.$state.user">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const route = useRoute();
const $app = useAppStore();

const { $telegram } = useNuxtApp();

const ref = route.query["ref"];
const kentId = ref ? (Array.isArray(ref) ? ref[0] || "" : ref).toString() : "";

const platform = $telegram.WebApp.platform;
if (platform == "tdesktop") {
  await router.push("/errors/use-mobile");
} else if (platform != "ios" && platform != "android") {
  navigateTo("https://t.me/cryppex_dev_bot/cryppex_dev_app", { external: true });
}

const potap =
  "user=%7B%22id%22%3A5288550634%2C%22first_name%22%3A%22Potap%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22SergioPotap%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-1260992627038743562&chat_type=private&auth_date=1719972346&hash=8b3b8b12361475d3951de90d327a341b19c0368d912fcdd85c5c75ef0474035d";

const setUser = async () => {
  const { $client } = useNuxtApp();
  const initData = $telegram.WebApp.initData;
  // const initData = potap;
  console.log(initData);
  const params = new URLSearchParams(initData);

  if (!initData) {
    await router.push("/errors/no-data");
  }
  try {
    const result = await $client.User.set.mutate({
      initData: JSON.stringify(initData),
      webAppUser: JSON.parse(<string>params.get("user"), (_k, _v) => (_k == "id" ? BigInt(_v) : _v)),
      kentId,
    });
    console.log(result);
    $app.$state.user = result;
  } catch (error) {
    console.error(error);
    await router.push("/errors/no-data");
  }
};

onBeforeMount(setUser);
</script>
