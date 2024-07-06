<template>
  <trx-balance />
  <v-data-table-server
    :items="items"
    :headers="headers"
    :loading="loading"
    :page="page"
    :items-length="total"
    :items-per-page="itemsPerPage"
    disable-sort
    density="compact"
    class="text-caption"
    @update:options="onOptions"
  >
    <template #[`item.startEpoch`]="{ item }">
      {{ formatEpoch(item.startEpoch) }}
    </template>
    <template #[`item.amount`]="{ item }">
      {{ formatTrx(item.amount) }}
    </template>
    <template #[`item.success`]="{ item }">
      <v-icon v-if="item.success" color="success" icon="mdi-check-circle-outline" size="16" />
      <v-icon v-else color="error" icon="mdi-close-circle-outline" size="16" />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { NIL } from "uuid";
import type { Pagination, Transaction } from "~/server/model/trpc";
import type { DataTableHeaders } from "~/server/model/ui";

const $app = useAppStore();
const { $client } = useNuxtApp();
const loading = ref(false);
const items = ref<Transaction[]>([]);
const itemsPerPage = ref(15);
const page = ref(1);
const total = ref(0);

const onOptions = async (pagination: Pagination) => {
  page.value = pagination.page || 1;
  itemsPerPage.value = pagination.itemsPerPage || 10;
  await list();
};

const list = async () => {
  const data = await $client.Wallet.list.query({
    userId: $app.$state.user?.id || NIL,
    pagination: {
      page: page.value,
      itemsPerPage: itemsPerPage.value,
    },
  });

  items.value = data.items;
  total.value = data.pagination?.total || 0;
};

const headers = computed<DataTableHeaders>(
  () =>
    [
      { title: "Date", key: "startEpoch", align: "start" },
      { title: "Operation", key: "operation", align: "start" },
      { title: "Amount", key: "amount", align: "end" },
      { title: "", key: "success", align: "end" },
    ] as const
);
</script>
