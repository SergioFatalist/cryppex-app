<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <div class="text-subtitle-2">My Current Investments</div>
      </v-col>
    </v-row>
  </v-container>
  <v-data-table
    :items="app.investments"
    :headers="headers"
    :loading="app.loading"
    hide-default-footer
    disable-sort
    density="compact"
    class="text-caption"
  />
</template>

<script setup lang="ts">
import type { DataTableHeaders } from "@/types/ui";
import dayjs from "dayjs";

const app = useAppStore();

onMounted(app.listInvestments);

const headers = computed<DataTableHeaders>(
  () =>
    [
      {
        title: "End",
        key: "finish",
        align: "start",
        value: (v) => v.finish && dayjs(v.finish).format("DD/MM/YY HH:mm"),
      },
      { title: "Amount", key: "amount", align: "end", value: (v) => v.amount },
      { title: "Interest", key: "interest", align: "end", value: (v) => v.interest },
      { title: "Rate", key: "rate", align: "end", value: (v) => `${v.rate}%` },
    ] as const
);
</script>
