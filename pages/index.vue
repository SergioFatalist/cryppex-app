<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <span class="text-subtitle-2">Hello</span>
        <br />
        <span v-if="$app.$state.user?.username" class="text-h6">
          <span class="text-grey">@</span>
          <span class="text-white">{{ $app.$state.user?.username }}</span>
        </span>
        <span v-else class="text-h6 text-white">
          {{ `${$app.$state.user?.first_name} ${$app.$state.user?.last_name}` }}
        </span>
      </v-col>
    </v-row>
  </v-container>
  <v-toolbar class="pl-4">
    <v-toolbar-items>
      <v-img src="/tron-trx.svg" class="ma-0 pa-0" width="64" alt="tron logo" />
    </v-toolbar-items>
    <v-toolbar-title>
      <span class="text-caption">Tron balance</span><br />
      <span>100 TRX</span>
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn prepend-icon="mdi-arrow-right-bold-hexagon-outline" variant="plain" size="large" class="pa-4">Send</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script setup lang="ts">
const $app = useAppStore();
</script>

