<template>
  <div class="text-white">{{ foo }}</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const router = useRouter();
const r = ref("");
const eee = ref("");

const foo = ref(Telegram.WebApp.);
const send = async () => {
  const { data, error, refresh, clear }  = await useFetch("/api/validate", {
    method: "POST",
    body: {
      data: Telegram.WebApp.initData
    },
  });

  r.value = data.value?.result.toString() ?? "undef";

  if (error) {
    eee.value = error.value ?? "unknown";
  }
};

onMounted(send);
</script>
