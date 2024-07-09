<template>
  <v-container>
    <v-row v-if="my">
      <v-col cols="12" class="d-flex justify-space-between">
        <div class="text-subtitle-2">Your Referrer</div>
        <div class="text-subtitle-2 text-white">{{ formatTgName(my) }}</div>
      </v-col>
    </v-row>
  </v-container>
  <v-toolbar color="secondary" class="pl-4">
    <v-toolbar-title>
      <span class="text-caption">Link to Invite a friends</span><br />
      <span class="text-caption">{{ refUrl }}</span>
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn prepend-icon="mdi-content-copy" variant="plain" size="large" class="pa-4" @click="copyUrl">Copy</v-btn>
    </v-toolbar-items>
  </v-toolbar>

  <v-data-table-server
    v-if="items.length > 0"
    :items="items"
    :headers="headers"
    :loading="loading"
    :page="page"
    :items-length="total"
    :items-per-page="itemsPerPage"
    :hide-default-footer="total == 0"
    disable-sort
    density="compact"
    class="text-caption"
    @update:options="onOptions"
  >
    <template #[`item.createdEpoch`]="{ item }">
      {{ formatEpoch(item.createdEpoch) }}
    </template>
    <template #[`item.username`]="{ item }">
      {{ formatTgName(item) }}
    </template>
    <template #[`item.balance`]="{ item }">
      {{ formatTrx(item.balance) }}
    </template>
  </v-data-table-server>
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
import { NIL } from "uuid";
import type { Pagination, User, UsersListItem } from "~/server/model/trpc";
import type { DataTableHeaders } from "~/server/model/ui";

const $app = useAppStore();
const config = useRuntimeConfig();
const { $client } = useNuxtApp();

const loading = ref(false);
const my = ref<User | undefined>(undefined);
const refUrl = computed(() => `${config.public.appUrl}/?ref=${$app.user?.telegramId}`);
const items = ref<UsersListItem[]>([]);
const itemsPerPage = ref(15);
const page = ref(1);
const total = ref(0);
const showSB = ref(false);
const { text, copy, copied } = useClipboard();

const copyUrl = () => {
  copy(refUrl.value);
  showSB.value = true;
};

const onOptions = async (pagination: Pagination) => {
  page.value = pagination.page || 1;
  itemsPerPage.value = pagination.itemsPerPage || 15;
  await list();
};

const get = async () => {
  if ($app.user?.referrerId) {
    my.value = await $client.User.get.query({
      id: $app.user.referrerId,
    });
  }
};

const list = async () => {
  const data = await $client.User.list.query({
    userId: $app.$state.user?.id || NIL,
    pagination: {
      page: page.value,
      itemsPerPage: itemsPerPage.value,
    },
  });

  items.value = data.items;
  total.value = data.pagination?.total || 0;
};

onMounted(get);

const headers = computed<DataTableHeaders>(
  () =>
    [
      { title: "Added", key: "createdEpoch", align: "start" },
      { title: "User", key: "username", align: "start" },
      { title: "Balance", key: "balance", align: "end" },
    ] as const
);
</script>
