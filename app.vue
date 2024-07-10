<template>
  <v-layout>
    <v-main>
      <NuxtPage />
    </v-main>
    <v-bottom-navigation>
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
const router = useRouter();
const route = useRoute();
const $app = useAppStore();

const { $telegram } = useNuxtApp();
const config = useRuntimeConfig();

const ref = route.query["ref"];
const kentId = ref ? (Array.isArray(ref) ? ref[0] || "" : ref).toString() : "";

const platform = $telegram.WebApp.platform;
if (platform == "tdesktop") {
  await router.push("/use-mobile");
} else if (platform != "ios" && platform != "android") {
  navigateTo(config.public.appUrl, { external: true });
}

// const potap =
//   "user=%7B%22id%22%3A5288550634%2C%22first_name%22%3A%22Potap%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22SergioPotap%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-1260992627038743562&chat_type=private&auth_date=1719972346&hash=8b3b8b12361475d3951de90d327a341b19c0368d912fcdd85c5c75ef0474035d";

const setUser = async () => {
  const { $client } = useNuxtApp();
  const initData = $telegram.WebApp.initData;
  // const initData = potap;

  if (!initData || initData.length < 10) {
    await router.push("/no-data");
    return;
  }
  const params = new URLSearchParams(initData);
  $telegram.WebApp.expand();
  try {
    const result = await $client.User.set.mutate({
      initData: JSON.stringify(initData),
      webAppUser: JSON.parse(<string>params.get("user"), (_k, _v) => (_k == "id" ? BigInt(_v) : _v)),
      kentId,
    });
    $app.setUser(result);
  } catch (error) {
    console.error(error);
    // await router.push("/no-data");
  }
};

onBeforeMount(setUser);
</script>
