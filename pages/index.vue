<template>
  <div>{{ config.public.testVar }}</div>
</template>

<script setup lang="ts">
import { useWebApp } from "vue-tg";
const app = useWebApp();
const config = useRuntimeConfig();

const send = async () => {
  const { error, data } = await useFetch("/api/validate", {
    method: "POST",
    body: app.initData,
  });

  console.log(data.value);

  if (error) {
    console.dir(error);
  }
};

onMounted(() => console.log(app.initData));
</script>
