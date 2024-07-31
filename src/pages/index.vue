<template>
  <v-layout>
    <v-app-bar color="surface-light" scroll-behavior="elevate">
      <v-app-bar-title>
        <v-img src="/logo-text.svg" alt="logo" width="180" />
      </v-app-bar-title>
      <v-spacer />
      <v-text-field v-model="app.address" hide-details="auto" variant="outlined" density="compact" label="TRON Address">
        <template #append-inner>
          <v-btn prepend-icon="mdi-login" rounded flat @click="app.login()">Login</v-btn>
        </template>
      </v-text-field>
      <div class="mx-2"></div>
      <v-btn id="lang-menu-activator" icon="mdi-translate" rounded flat />
      <v-btn
        :icon="app.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
        flat
        rounded
        @click="app.toggleDark()"
      />
      <v-menu activator="#lang-menu-activator">
        <v-list>
          <v-list-item v-for="(item, index) in langs" :key="index" @click="app.setLang(item.lang)">
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main class="mt-2">
      <v-container class="d-flex flex-wrap ga-4 justify-center align-center mb-16">
        <v-row class="content-wrapper">
          <v-col class="flex-lg-1-1-0 flex-sm-1-1-100">
            <v-card class="fill-height text-center py-8" min-width="300">
              <v-card-item>
                <v-icon icon="mdi-finance" color="secondary" size="48" class="mb-8" />
                <v-card-title class="text-wrap">{{ $t("BALANCE") }}</v-card-title>
              </v-card-item>
              <v-card-text class="text-h6">{{ (app.counter / 1_000_000).toFixed(9) }} TRX</v-card-text>
            </v-card>
          </v-col>
          <v-col class="flex-lg-1-1-0 flex-sm-1-1-100">
            <v-card class="fill-height text-center py-8" min-width="300">
              <v-card-item>
                <v-icon icon="mdi-clock-check-outline" color="secondary" size="48" class="mb-8" />
                <v-card-title class="text-wrap">{{ $t("Bonus Stake") }}</v-card-title>
              </v-card-item>
              <v-card-item class="text-h6">{{ (app.counter2 / 1_000_000_000).toFixed(9) }} TRX</v-card-item>
              <v-card-item class="text-amber-accent-1"> Daily Bonus - 3% </v-card-item>
            </v-card>
          </v-col>
          <v-col class="flex-lg-1-1-0 flex-sm-1-1-100">
            <v-card class="fill-height text-center py-8" min-width="300">
              <v-icon icon="mdi-percent-box" color="secondary" size="48" class="mb-8" />
              <v-card-title class="text-wrap">{{ $t("Your profit") }}</v-card-title>
              <v-card-item v-if="app.address">
                <v-btn @click="showQRDialog = true">Invest NOW</v-btn>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <NuxtPage />
    </v-main>
  </v-layout>

  <v-dialog v-model="showQRDialog" min-width="50%">
    <v-sheet class="text-center pa-4">
      <div class="text-h6">{{ $t("Top Up balance") }}</div>
      <div class="text-caption">{{ $t("Send TRX to address") }}</div>
      <div class="my-4">
        <qr-code
          :value="app.address"
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
          @click="copyAddress(app.address || '')"
        >
          {{ app.address }}
        </v-btn>
        <span v-else>{{ app.address }}</span>
      </div>
    </v-sheet>
  </v-dialog>

  <v-snackbar v-model="showSB" :close-delay="2" variant="flat" color="primary">
    <div class="text-body-2">{{ alert }}</div>
    <template #actions>
      <v-btn icon="mdi-close" @click="showSB = false"> </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const app = useAppStore();
const { copy, copied, isSupported } = useClipboard();
const { t } = useI18n();

definePageMeta({
  layout: "clean",
});

const showQRDialog = ref<boolean>(false);
const showSB = ref<boolean>(false);
const alert = ref<string>("");

const langs = [
  { title: "English", lang: "en" },
  { title: "Русский", lang: "ru" },
];

const copyAddress = (address: string) => {
  copy(address);
  showQRDialog.value = false;
  alert.value = t("Copied to clibpoard {0}", [address]);
  if (copied) {
    showSB.value = true;
  }
};

setInterval(() => (app.counter2 += 34), 250);
</script>

<style scoped></style>
