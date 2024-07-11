<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <div class="text-subtitle-2">My Wallet</div>
      </v-col>
    </v-row>
  </v-container>
  <v-toolbar color="secondary" class="pl-4">
    <v-toolbar-items>
      <v-img src="/tron-trx.svg" class="ma-0 pa-0" width="64" alt="tron logo" />
    </v-toolbar-items>
    <v-toolbar-title>
      <span class="text-caption">Tron balance</span><br />
      <span>{{ formatTrx($app.$state.user?.balance) }} TRX</span>
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn
        prepend-icon="mdi-arrow-right-bold-hexagon-outline"
        variant="plain"
        size="large"
        class="pa-4"
        @click="showSendDialog = true"
        >Send</v-btn
      >
    </v-toolbar-items>
  </v-toolbar>
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
  <v-dialog v-model="showSendDialog" min-width="75%">
    <v-form validate-on="submit lazy" @submit.prevent="send">
      <v-container class="bg-surface" fluid>
        <v-row>
          <v-col cols="12">
            <div class="text-h6">Send TRX</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="amount"
              :rules="[
                (v) => rules.equalOrGreaterThan(v, '1'),
                (v) => rules.lessThan((v * 1000000).toString(), String($app.$state.user?.balance || 0)),
              ]"
              type="number"
              label="Amount"
            />
          </v-col>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="to" :rules="[rules.required]" type="" label="Tron TRX Address" />
            </v-col>
          </v-row>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn type="submit" color="primary" outlined>Withdraw</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { NIL } from "uuid";
import type { SubmitEventPromise } from "vuetify";
import type { Pagination, Transaction } from "~/server/model/trpc";
import type { DataTableHeaders } from "~/server/model/ui";

const $app = useAppStore();
const { $client } = useNuxtApp();
const rules = useValidationRules();

const loading = ref(false);
const items = ref<Transaction[]>([]);
const itemsPerPage = ref(15);
const page = ref(1);
const total = ref(0);
const showSendDialog = ref(false);
const to = ref("");
const amount = ref(0);

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

const send = async (event: SubmitEventPromise) => {
  if ((await event).valid && $app.$state.user?.id) {
    await $client.Wallet.send.mutate({
      userId: $app.$state.user?.id,
      amount: BigInt(amount.value * 1000000),
      to: to.value,
    });
    showSendDialog.value = false;
    await list();
  }
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
