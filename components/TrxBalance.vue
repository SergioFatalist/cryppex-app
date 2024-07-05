<template>
  <v-toolbar class="pl-4">
    <v-toolbar-items>
      <v-img src="/tron-trx.svg" class="ma-0 pa-0" width="64" alt="tron logo" />
    </v-toolbar-items>
    <v-toolbar-title>
      <span class="text-caption">Tron balance</span><br />
      <span>{{ balance }} TRX</span>
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn prepend-icon="mdi-arrow-right-bold-hexagon-outline" variant="plain" size="large" class="pa-4">Send</v-btn>
    </v-toolbar-items>
  </v-toolbar>

</template>

<script setup lang="ts">
const $app = useAppStore();
const balance = computed(() =>
  $app.$state.user?.balance ? parseFloat(String($app.$state.user?.balance / 1000000)).toFixed(3) : 0
);
</script>
