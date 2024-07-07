<template>
  <div class="d-block h-100">
    <div class="d-flex flex-column justify-space-between h-100">
      <div class="flex-0-0">
        <div class="pa-4">
          <span class="text-subtitle-2">Hello</span>
          <br />
          <span class="text-h6 text-white">
            {{ formatTgName($app.user) }}
          </span>
        </div>
        <trx-balance />
      </div>
      <div class="flex-0-0 text-center pb-6">
        <v-btn color="secondary" variant="flat" size="x-large" @click="showQR = true">
          <span class="text-white">TOP UP<br />balance</span>
        </v-btn>
      </div>
    </div>
  </div>
  <v-dialog v-model="showQR" min-width="75%">
    <v-sheet class="text-center pa-4">
      <div class="text-h6">Top Up balance</div>
      <div class="text-caption">Send TRX to address</div>
      <div class="my-4">
        <qr-code
          :value="$app.user?.address"
          background="#161A2E"
          foreground="#FFFFFF"
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
          @click="copyAddress($app.user?.address || '')"
        >
          {{ $app.user?.address }}
        </v-btn>
        <span v-else>{{ $app.user?.address }}</span>
      </div>
    </v-sheet>
  </v-dialog>
  <v-snackbar v-model="showSB" :close-delay="2" variant="flat" color="primary">
    <div class="text-body-2">Copied to clibpoard {{ text }}</div>
    <template #actions>
      <v-btn icon="mdi-close" @click="showSB = false"> </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import TrxBalance from "~/components/TrxBalance.vue";

const $app = useAppStore();
const showQR = ref(false);
const showSB = ref(false);
const { text, copy, copied, isSupported } = useClipboard();

const copyAddress = (address: string) => {
  copy(address);
  showQR.value = false;
  if (copied) {
    showSB.value = true;
  }
};
</script>
