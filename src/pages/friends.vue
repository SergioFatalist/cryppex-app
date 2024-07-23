<template>
  <v-toolbar color="secondary" class="pl-4">
    <v-toolbar-title>
      <span class="text-caption">Link to Invite</span><br />
      <span class="text-caption">{{ refUrl }}</span>
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn color="warning" variant="tonal" size="large" @click="copyUrl">Copy<br />link</v-btn>
    </v-toolbar-items>
  </v-toolbar>

  <v-data-table
    :items="app.referrals"
    :headers="headers"
    :loading="app.loading"
    hide-default-footer
    disable-sort
    density="compact"
    class="text-caption"
  >
    <template #[`item.username`]="{ item }">
      {{ formatTgName(item) }}
    </template>
    <template #[`item.pending`]="{ item }">
      {{ item.pending ? (item.pending / 1_000_000).toFixed(2) : 0 }}
    </template>
    <template #[`item.applied`]="{ item }">
      {{ item.applied ? (item.applied / 1_000_000).toFixed(2) : 0 }}
    </template>
    <template #[`item.balance`]="{ item }">
      {{ item.balance ? (item.balance / 1_000_000).toFixed(2) : 0 }}
    </template>
  </v-data-table>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center text-h6">Invite firiends for referral bonuses</v-col>
      <v-col cols="12" class="text-center">More friends more bonuses</v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="showSB" :close-delay="2" variant="flat" color="primary">
    <div class="text-body-2">Copied to clibpoard {{ text }}</div>
    <template #actions>
      <v-btn icon="mdi-close" @click="showSB = false"> </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import type { DataTableHeaders } from "@/types/ui";

const app = useAppStore();
const config = useRuntimeConfig();

const refUrl = computed(() => `${config.public.appUrl}?startapp=${app.user?.id}`);
const showSB = ref(false);
const { text, copy } = useClipboard();

const copyUrl = () => {
  copy(refUrl.value);
  showSB.value = true;
};

const headers = computed<DataTableHeaders>(
  () =>
    [
      { title: "User", key: "username", align: "start" },
      { title: "Pending", key: "pending", align: "end" },
      { title: "Applied", key: "applied", align: "end" },
      { title: "Balance", key: "balance", align: "end" },
    ] as const
);
</script>
