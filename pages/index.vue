<template>
  <div class="text-white">{{ h }}</div>
  <div class="text-white">{{ r }}</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const router = useRouter();
const h = ref(Telegram.WebApp.platform);
const r = ref("");
const send = async () => {
  const data = await $fetch("/api/validate", {
    method: "POST",
    body: Telegram.WebApp.initData,
  });

  r.value = data.result.toString();

  // if (error) {
  //   console.dir(error);
  // }
};

onMounted(send);
</script>
