<template>
  <div>{{ config.public.testVar }}</div>
  <v-btn @click="send">BUTTON! {{ s }} {{ h }}}</v-btn>
</template>

<script setup lang="ts">
import { useWebApp } from "vue-tg";

const app = useWebApp();
const s = ref<boolean>();
const h = ref("");

const config = useRuntimeConfig();

const send = async () => {
  const result = await $fetch("/api/validate", {
    method: "POST",
    body: app.initData,
  });

  console.dir(result);
};
</script>
