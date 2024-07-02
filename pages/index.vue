<template>
  <div class="text-white">{{ app.isReady }}</div>
</template>

<script setup lang="ts">
import { useWebApp } from "vue-tg";
const app = useWebApp();
const config = useRuntimeConfig();
const h = ref();

const send = async () => {
  const data = await $fetch("/api/validate", {
    method: "POST",
    body: app.initData,
  });

  h.value = data;

  // if (error) {
  //   console.dir(error);
  // }
};

onMounted(send);
</script>
