<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <div class="text-subtitle-2">My Current Investments</div>
      </v-col>
    </v-row>
  </v-container>
  <v-data-table-server
    :items="app.investments"
    :headers="headers"
    :loading="app.getViewState.loading"
    :page="app.getViewState.pagination?.page"
    :items-length="app.getViewState.pagination?.total || 0"
    :items-per-page="app.getViewState.pagination?.itemsPerPage"
    :hide-default-footer="app.getViewState.pagination?.total == 0"
    disable-sort
    density="compact"
    class="text-caption"
    @update:options="app.listInvestments"
  >
  </v-data-table-server>
</template>

<script setup lang="ts">
import type { DataTableHeaders } from "@/types/ui";

const app = useAppStore();
const headers = computed<DataTableHeaders>(
  () =>
    [
      { title: "End", key: "endEpoch", align: "start", value: (i) => formatEpoch(i.endEpoch) },
      { title: "Amount", key: "amount", align: "end", value: (i) => i.amount },
      { title: "Interest", key: "interest", align: "end", value: (i) => i.interest },
      { title: "Rate", key: "rate", align: "end", value: (i) => `${i.rate}%` },
    ] as const
);
</script>
