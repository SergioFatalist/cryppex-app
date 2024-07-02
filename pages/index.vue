<template>
  <div class="text-white">{{ res }}</div>
</template>

<script setup lang="ts">
const res = ref("");
const tg = (window as any).Telegram;

const send = async () => {
  const initData = tg.WebApp.initData;
  const { data } = await useFetch("/api/validate", {
    method: "POST",
    body: JSON.stringify({ initData }),
  });

  res.value = data.value?.result.toString() ?? "undef";
};

onMounted(send);
</script>
