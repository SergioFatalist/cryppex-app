<template>
  <v-toolbar color="secondary" class="pl-4">
    <v-toolbar-title>
      <span class="text-caption">{{ $t("Invite link") }}</span>
      <br />
      <span class="text-caption">{{ refUrl }}</span>
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn color="warning" variant="tonal" size="large" @click="copyUrl">{{ $t("Copy link") }}</v-btn>
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
  </v-data-table>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center text-h6">{{ $t("Invite friends for referral bonuses") }}</v-col>
      <v-col cols="12" class="text-center">{{ $t("More friends more bonuses") }}</v-col>
      <v-col cols="12" class="text-center">{{ refUrl }}</v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="showSB" :close-delay="2" variant="flat" color="primary">
    <div class="text-body-2">{{ $t("Copied to clibpoard {0}", [text]) }}</div>
    <template #actions>
      <v-btn icon="mdi-close" @click="showSB = false"> </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import type { DataTableHeaders } from "@/types/ui";

definePageMeta({
  layout: "app",
});

const app = useAppStore();
const config = useRuntimeConfig();
const { t } = useI18n();

const refUrl = computed(() => `${config.public.appUrl}?startapp=${app.user?.id}`);
const showSB = ref(false);
const { text, copy } = useClipboard();

const copyUrl = () => {
  copy(refUrl.value);
  showSB.value = true;
};

onMounted(app.listReferrals);

const headers = computed<DataTableHeaders>(
  () =>
    [
      { title: t("User"), key: "username", align: "start" },
      { title: t("Pending"), key: "pending", align: "end" },
      { title: t("Applied"), key: "applied", align: "end" },
      { title: t("Balance"), key: "balance", align: "end" },
    ] as const
);
</script>
