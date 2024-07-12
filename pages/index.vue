<template>
  <div v-if="app.$state.user?.id" class="d-block h-100">
    <div class="d-flex flex-column justify-space-between h-100">
      <div class="flex-0-0">
        <div class="d-flex justify-space-between px-4 pt-0 pb-2">
          <div class="flex-0-0">
            <span class="text-subtitle-2">Hello</span>
            <br />
            <span class="text-h6 text-white">{{ formatTgName(app.user) }}</span>
          </div>
          <div class="flex-0-0 text-center">
            <v-btn color="secondary" variant="flat" size="x-large" @click="showQRDialog = true">
              <span class="text-white">TOP UP<br />balance</span>
            </v-btn>
          </div>
        </div>
        <div class="d-flex bg-secondary text-white text-center py-2">
          <div class="flex-1-1">
            <span class="text-caption">Balance</span>
            <br />
            <span>{{ formatTrx(app.$state.summary.balance) }}</span>
            <br />TRX
          </div>
          <div class="flex-1-1">
            <span class="text-caption">Invests</span>
            <br />
            <span>{{ app.$state.summary.count }}</span>
          </div>
          <div class="flex-1-1">
            <span class="text-caption">Locked</span>
            <br />
            <span>{{ formatTrx(app.$state.summary.amount) }}</span>
            <br />TRX
          </div>
          <div class="flex-1-1">
            <span class="text-caption">Interests</span>
            <br />
            <span>{{ formatTrx(app.$state.summary.interest) }}</span>
            <br />TRX
          </div>
        </div>
      </div>
      <v-container class="mt-2">
        <v-row class="px-4">
          <v-col cols="12" class="d-flex justify-space-between first my-2 px-xs-2 py-xs-1 pa-sm-4">
            <div class="text-caption">
              <span class="text-h6">Beginner</span><br />
              Minimal - 100 TRX<br />
              Interest - 10%<br />
              Term - 20 days
            </div>
            <div class="d-flex flex-column justify-space-around">
              <v-btn variant="outlined" @click="showApply(100, 10)">Apply</v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row class="px-4">
          <v-col cols="12" class="d-flex justify-space-between second my-2 px-xs-2 py-xs-1 pa-sm-4">
            <div class="text-caption">
              <span class="text-h6">Confident</span><br />
              Minimal - 500 TRX<br />
              Interest - 20%<br />
              Term - 30 days
            </div>
            <div class="d-flex flex-column justify-space-around">
              <v-btn variant="outlined" @click="showApply(500, 20)">Apply</v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row class="px-4">
          <v-col cols="12" class="d-flex justify-space-between third my-2 px-xs-2 py-xs-1 pa-sm-4">
            <div class="text-caption">
              <span class="text-h6">Professional</span><br />
              Minimal - 1000 TRX<br />
              Interest - 30%<br />
              Term - 40 days
            </div>
            <div class="d-flex flex-column justify-space-around">
              <v-btn variant="outlined" @click="showApply(1000, 30)">Apply</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-spacer />
    </div>
  </div>
  <v-dialog v-model="showQRDialog" min-width="75%">
    <v-sheet class="text-center pa-4">
      <div class="text-h6">Top Up balance</div>
      <div class="text-caption">Send TRX to address</div>
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
      <div class="text-center mt-4">
        <v-btn variant="outlined" text="Copy to clipboard" @click="copyAddress(app.user?.address || '')" />
      </div>
    </v-sheet>
  </v-dialog>
  <v-dialog v-model="showApplyDialog" min-width="75%">
    <v-form validate-on="submit lazy" @submit.prevent="apply">
      <v-container class="bg-surface" fluid>
        <v-row>
          <v-col cols="12">
            <div class="text-h6">Invest as {{ investTitle.get(investRate) }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="investAmount"
              :rules="[rules.decimal, (v) => rules.equalOrGreaterThan(v, minimalAmount.toString())]"
              type="number"
              label="Amount"
            />
            <v-checkbox v-model="approveRules" label="Approve rules" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn :disabled="!approveRules" type="submit" color="primary" outlined>Invest</v-btn>
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
import type { InvestmentSummary } from "~/server/lib/schema";

const investTitle = new Map<number, string>([
  [10, "Beginner"],
  [20, "Confident"],
  [30, "Professional"],
]);

const app = useAppStore();
const rules = useValidationRules();
const { copy, copied, isSupported } = useClipboard();
const showQRDialog = ref(false);
const showApplyDialog = ref(false);
const showSB = ref(false);
const alert = ref("");
const minimalAmount = ref(100);
const investAmount = ref(0);
const investRate = ref(10);
const approveRules = ref(false);

const copyAddress = (address: string) => {
  copy(address);
  showQRDialog.value = false;
  alert.value = `Copied to clibpoard ${address}`;
  if (copied) {
    showSB.value = true;
  }
};

const showApply = (min: number, rate: number) => {
  if (app.$state.summary.balance < BigInt(min * 1000000)) {
    alert.value = "Insufficient funds. Top up your balance please";
    showSB.value = true;
    return;
  }
  investAmount.value = min;
  minimalAmount.value = min;
  investRate.value = rate;
  showApplyDialog.value = true;
};

const load = async () => {
  if (app.$state.user?.id) {
    app.$state.summary = await $fetch<InvestmentSummary>("/api/invests-summary", {
      method: "POST",
      body: {
        id: app.$state.user.id,
      },
      onRequestError: ({ error }) => console.error(error),
    });
  }
};

const apply = async (event: SubmitEventPromise) => {
  if ((await event).valid && app.$state.user?.id) {
    if (app.$state.user?.id) {
      await $fetch<InvestmentSummary>("/api/invest", {
        method: "POST",
        body: {
          userId: app.$state.user.id,
          rate: investRate.value,
          amount: investAmount.value * 1000000,
        },
        onRequestError: ({ error }) => console.error(error),
      });
    }
  }
  await load();
  showApplyDialog.value = false;
};

onBeforeMount(load);
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
