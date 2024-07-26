<template>
  <div class="d-block h-100">
    <div class="d-flex flex-column justify-space-between h-100">
      <div class="flex-0-0">
        <v-toolbar color="secondary" class="pl-4">
          <v-toolbar-title>
            <span class="text-subtitle-2">{{ $t("Hello") }}</span>
            <br />
            <span class="text-h6">{{ formatTgName(app.user) }}</span>
          </v-toolbar-title>
          <v-toolbar-items>
            <v-btn color="warning" variant="tonal" size="large" class="text-wrap" @click="showQRDialog = true">
              {{ $t("Deposit") }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="d-flex text-center py-2">
          <div class="flex-1-1">
            <span class="text-caption">{{ $t("Balance") }}</span>
            <br />
            <span>{{ app.user?.balance || 0 }}</span>
            <br />TRX
          </div>
          <div class="flex-1-1">
            <span class="text-caption">{{ $t("Invests") }}</span>
            <br />
            <span>{{ app.user?.investsCount || 0 }}</span>
          </div>
          <div class="flex-1-1">
            <span class="text-caption">{{ $t("Interests") }}</span>
            <br />
            <span>{{ app.user?.investsInterest || 0 }}</span>
            <br />TRX
          </div>
        </div>
      </div>
      <v-container class="mt-2">
        <v-row class="px-4">
          <v-col cols="12" class="d-flex justify-space-between first my-2 px-xs-2 py-xs-1 pa-sm-4">
            <div class="text-caption">
              <span class="text-h6">{{ $t("Beginner") }}</span>
              <br />
              {{ $t("Minimal - {0} TRX", ["100"]) }}<br />
              {{ $t("Interest - {0}%", ["10"]) }}<br />
              {{ $t("Term - {0} days", ["20"]) }}
            </div>
            <div class="d-flex flex-column justify-space-around">
              <v-btn variant="outlined" @click="showApply(100, 10)">{{ $t("Invest now") }}</v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row class="px-4">
          <v-col cols="12" class="d-flex justify-space-between second my-2 px-xs-2 py-xs-1 pa-sm-4">
            <div class="text-caption">
              <span class="text-h6">{{ $t("Confident") }}</span>
              <br />
              {{ $t("Minimal - {0} TRX", ["500"]) }}<br />
              {{ $t("Interest - {0}%", ["20"]) }}<br />
              {{ $t("Term - {0} days", ["30"]) }}
            </div>
            <div class="d-flex flex-column justify-space-around">
              <v-btn variant="outlined" @click="showApply(500, 20)">{{ $t("Invest now") }}</v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row class="px-4">
          <v-col cols="12" class="d-flex justify-space-between third my-2 px-xs-2 py-xs-1 pa-sm-4">
            <div class="text-caption">
              <span class="text-h6">{{ $t("Professional") }}</span>
              <br />
              {{ $t("Minimal - {0} TRX", ["1000"]) }}<br />
              {{ $t("Interest - {0}%", ["30"]) }}<br />
              {{ $t("Term - {0} days", ["40"]) }}
            </div>
            <div class="d-flex flex-column justify-space-around">
              <v-btn variant="outlined" @click="showApply(1000, 30)">{{ $t("Invest now") }}</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-spacer />
    </div>
  </div>
  <v-dialog v-model="showQRDialog" min-width="75%">
    <v-sheet class="text-center pa-4">
      <div class="text-h6">{{ $t("Top Up balance") }}</div>
      <div class="text-caption">{{ $t("Send TRX to address") }}</div>
      <div class="my-4">
        <qr-code
          :value="app.user?.address"
          :background="'#161a2e'"
          :foreground="'#ffffff'"
          :size="200"
          level="H"
          render-as="svg"
        />
      </div>
      <div>
        <v-btn
          v-if="isSupported"
          variant="outlined"
          class="text-none text-caption"
          append-icon="mdi-content-copy"
          @click="copyAddress(app.user?.address || '')"
        >
          {{ app.user?.address }}
        </v-btn>
        <span v-else>{{ app.user?.address }}</span>
      </div>
    </v-sheet>
  </v-dialog>
  <v-dialog v-model="showApplyDialog" min-width="75%">
    <v-form validate-on="submit lazy" @submit.prevent="apply">
      <v-container class="bg-surface" fluid>
        <v-row>
          <v-col cols="12">
            <div class="text-h6">{{ $t("Invest as {0}", [investTitle.get(investRate)?.title || "o_O"]) }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="investAmount"
              :rules="[rules.decimal, (v) => rules.equalOrGreaterThan(v, minimalAmount.toString())]"
              :label="t('Amount')"
              type="number"
              hide-spin-buttons
            />
            <v-slider
              v-model="investAmount"
              :min="minimalAmount"
              :max="app.user?.balance"
              :step="Math.round((app.user?.balance || 0) / 4) - minimalAmount"
              show-ticks="always"
              tick-size="4"
            />
            <v-checkbox v-model="approveRules" :label="t('Approve rules')" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn :disabled="!approveRules" type="submit" color="primary" outlined>{{ $t("Invest") }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-dialog>
  <v-snackbar v-model="showSB" :close-delay="2" variant="flat" color="primary">
    <div class="text-body-2">{{ alert }}</div>
    <template #actions>
      <v-btn icon="mdi-close" @click="showSB = false"> </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import type { SubmitEventPromise } from "vuetify";

type Rate = 10 | 20 | 30;
const investTitle = new Map<Rate, { min: number; title: string }>([
  [10, { min: 100, title: "Beginner" }],
  [20, { min: 500, title: "Confident" }],
  [30, { min: 1000, title: "Professional" }],
]);

const app = useAppStore();
const rules = useValidationRules();
const { copy, copied, isSupported } = useClipboard();
const { t } = useI18n();
const showQRDialog = ref<boolean>(false);
const showApplyDialog = ref<boolean>(false);
const showSB = ref<boolean>(false);
const alert = ref<string>("");
const minimalAmount = ref<number>(100);
const investAmount = ref<number>(0);
const investRate = ref<Rate>(10);
const approveRules = ref(true);

const copyAddress = (address: string) => {
  copy(address);
  showQRDialog.value = false;
  alert.value = t("Copied to clibpoard {0}", [address]);
  if (copied) {
    showSB.value = true;
  }
};

const showApply = (min: number, rate: Rate) => {
  if (!app.user || app.user?.balance < min) {
    alert.value = t("Insufficient funds - top up your balance please");
    showSB.value = true;
    return;
  }
  investAmount.value = min;
  minimalAmount.value = min;
  investRate.value = rate;
  showApplyDialog.value = true;
};

const apply = async (event: SubmitEventPromise) => {
  if ((await event).valid) {
    await app.invest(investRate.value, investAmount.value);
  }
  showApplyDialog.value = false;
};

onBeforeMount(app.loadUser);
</script>

<style scoped>
.first {
  color: #161a2e;
  background-color: #3eb8f9;
  border-radius: 8px;
  border-color: #cccccc;
  border-width: 2px;
}

.second {
  color: #161a2e;
  background-color: #87e21f;
  border-radius: 8px;
  border-color: #cccccc;
  border-width: 2px;
}

.third {
  color: #161a2e;
  background-color: #ffe121;
  border-radius: 8px;
  border-color: #cccccc;
  border-width: 2px;
}
</style>
