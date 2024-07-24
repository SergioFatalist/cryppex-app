<template>
  <v-toolbar color="secondary" class="pl-4">
    <v-toolbar-title>
      {{ $t("My current Investments") }}
    </v-toolbar-title>
  </v-toolbar>
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
import type { DataTableHeaders } from "~/types/ui";
import dayjs from "dayjs";

const app = useAppStore();
const { t } = useI18n();

onMounted(app.listInvestments);

const headers = computed<DataTableHeaders>(
  () =>
    [
      {
        title: t("End"),
        key: "finish",
        align: "start",
        value: (v) => v.finish && dayjs(v.finish).format("DD/MM/YY HH:mm"),
      },
      { title: t("Amount"), key: "amount", align: "end", value: (v) => v.amount },
      { title: t("Interests"), key: "interest", align: "end", value: (v) => v.interest },
      { title: t("Rate"), key: "rate", align: "end", value: (v) => `${v.rate}%` },
    ] as const
);
</script>
