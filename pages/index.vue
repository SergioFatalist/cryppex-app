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
        <v-btn color="surface-bright" variant="tonal" size="x-large" @click="showQR = true">
          <span class="text-white">TOP UP<br />balance</span>
        </v-btn>
      </div>
    </div>
  </div>
  <v-dialog v-model="showQR" min-width="75%">
    <v-sheet>
      <qr-code value="value" :size="100" level="H" />
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
import TrxBalance from "~/components/TrxBalance.vue";

const $app = useAppStore();
const showQR = ref(false);
</script>
