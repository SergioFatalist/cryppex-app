<template>
  <v-toolbar color="secondary" class="pl-4">
    <v-toolbar-items>
      <v-img src="/tron-trx.svg" class="ma-0 pa-0" width="64" alt="tron logo" />
    </v-toolbar-items>
    <v-toolbar-title>
      <span class="text-caption">{{ $t("Balance") }}</span>
      <br />
      <span>{{ app.$state.user?.balance }} TRX</span>
    </v-toolbar-title>
    <v-toolbar-items>
      <v-btn
        :disabled="!app.user?.balance || app.user?.balance < 99"
        color="warning"
        variant="tonal"
        size="large"
        @click="showSendDialog = true"
      >
        {{ $t("Withdraw") }}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <v-data-table
    :items="app.transactions"
    :headers="headers"
    :loading="app.loading"
    hide-default-footer
    disable-sort
    density="compact"
    class="text-caption"
    @update:options="app.listTransactions"
  >
    <template #[`item.success`]="{ item }">
      <v-icon v-if="item.success" color="success" icon="mdi-check-circle-outline" size="16" />
      <v-icon v-else color="error" icon="mdi-close-circle-outline" size="16" />
    </template>
  </v-data-table>
  <v-dialog v-model="showSendDialog" min-width="75%">
    <v-form validate-on="submit lazy" @submit.prevent="send">
      <v-container class="bg-surface" fluid>
        <v-row>
          <v-col cols="12">
            <div class="text-h6">{{ $t("Send TRX") }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="amount"
              :rules="[
                (v) => rules.lessThan(v.toString(), (app.$state.user?.balance || 0).toString()),
                (v) => rules.equalOrGreaterThan(v, '1'),
              ]"
              :label="t('Amount')"
              type="number"
              hide-spin-buttons
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="to" :rules="[rules.required]" :label="t('Tron TRX Address')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              {{
                $t("The transfer fee {0} TRX will be deducted from the transfer amount", [
                  config.public.sendFeeAbsolute,
                ])
              }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn type="submit" color="primary" outlined>{{ $t("Withdraw") }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { SubmitEventPromise } from "vuetify";
import type { DataTableHeaders } from "@/types/ui";

definePageMeta({
  layout: "app",
});

const app = useAppStore();
const rules = useValidationRules();
const config = useRuntimeConfig();
const { t } = useI18n();

const showSendDialog = ref(false);
const to = ref("");
const amount = ref(0);

const send = async (event: SubmitEventPromise) => {
  if ((await event).valid) {
    await app.sendTrx(to.value, amount.value);
    showSendDialog.value = false;
  }
};

onMounted(app.listTransactions);

const headers = computed<DataTableHeaders>(
  () =>
    [
      {
        title: t("Date"),
        key: "txTime",
        align: "start",
        value: (v) => v.txTime && dayjs(v.txTime).format("DD/MM/YY HH:mm"),
      },
      { title: t("Type"), key: "type", align: "start" },
      { title: t("Amount"), key: "amount", align: "end" },
      { title: "", key: "success", align: "end" },
    ] as const
);
</script>
