<template>
  <div class="text-white">{{ h }}</div>
</template>

<script setup lang="ts">
import { useWebApp } from "vue-tg";
const app = useWebApp();
const config = useRuntimeConfig();
const h = ref(Telegram.WebApp.platform);

const send = async () => {
  const data = await $fetch("/api/validate", {
    method: "POST",
    body: app.initData,
  });

  // if (error) {
  //   console.dir(error);
  // }
};

onMounted(send);
</script>
