<template>
  <div>sample</div>
  {{ app.isReady }}
</template>

<script setup lang="ts">
import { useWebApp } from "vue-tg";

const app = useWebApp();
</script>

<style scoped></style>
