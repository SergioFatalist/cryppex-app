<template>
  <div>{{ s }}</div>
  <v-btn @click="send">BUTTON!</v-btn>
</template>

<script setup lang="ts">
import { MainButton, useWebApp } from "vue-tg";

const app = useWebApp();
const s = ref("empty");

const send = () => app.sendData("somedata");

const handleMainButton = () => {
  console.dir(s.value);
};
</script>

<style scoped></style>
