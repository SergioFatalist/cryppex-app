<template>
  <div>{{ s }}</div>
  <v-btn @click="send">BUTTON! {{ s }} {{ h }}}</v-btn>
</template>

<script setup lang="ts">
import { useWebApp } from "vue-tg";

const app = useWebApp();
const { $client } = useNuxtApp();
const s = ref<boolean>();
const h = ref("");

const send = async () => {
  const result = await $client.validation.initData.query({
    initData: app.initData,
  });
  console.dir(result);
  s.value = result.result;
};
</script>
