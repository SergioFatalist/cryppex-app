<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <div class="text-subtitle-2">My Current Investments</div>
      </v-col>
    </v-row>
  </v-container>
  <v-data-table-server
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
  </v-data-table-server>
</template>

<script setup lang="ts">
import { NIL } from "uuid";
import type { Investment, Pagination } from "~/server/model/trpc";
import type { DataTableHeaders } from "~/server/model/ui";

const $app = useAppStore();
const { $client } = useNuxtApp();
const loading = ref(false);
const items = ref<Investment[]>([]);
const itemsPerPage = ref(15);
const page = ref(1);
const total = ref(0);

const onOptions = async (pagination: Pagination) => {
  page.value = pagination.page || 1;
  itemsPerPage.value = pagination.itemsPerPage || 10;
  await list();
};

const list = async () => {
  const data = await $client.Investment.list.query({
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
      { title: "End", key: "endEpoch", align: "start", value: (i) => formatEpoch(i.endEpoch) },
      { title: "Amount", key: "amount", align: "end", value: (i) => formatTrx(i.amount) },
      { title: "Interest", key: "interest", align: "end", value: (i) => formatTrx(i.interest) },
      { title: "Rate", key: "rate", align: "end", value: (i) => `${i.rate}%` },
    ] as const
);
</script>
