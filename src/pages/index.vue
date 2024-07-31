<template>
  <v-layout>
    <v-app-bar color="surface-light" scroll-behavior="elevate">
      <v-app-bar-title>
        <v-img src="/logo-text-trans.svg" alt="logo" width="180" />
      </v-app-bar-title>
      <v-spacer />
      <v-form v-if="!app.address" validate-on="submit lazy" @submit.prevent="siteLogin">
        <v-text-field
          v-model="app.login"
          :rules="[rules.required]"
          hide-details="auto"
          variant="outlined"
          density="compact"
          label="TRON Address"
          min-width="400"
        >
          <template #append>
            <v-btn type="submit" prepend-icon="mdi-login" rounded flat>Login</v-btn>
          </template>
        </v-text-field>
      </v-form>
      <div v-else class="ttt">
        {{ app.login }}
        <v-tooltip text="Withdraw" location="bottom">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-send-outline" rounded flat @click="send()" />
          </template>
        </v-tooltip>
        <v-btn icon="mdi-logout" rounded flat @click="app.siteLogout()" />
      </div>
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
                <v-card-title class="text-wrap">{{ $t("BALANCE") }} {{ app.address ? "" : "DEMO" }}</v-card-title>
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
              <v-card-item class="text-h6">{{ (app.counter2 / 1_000_000).toFixed(9) }} TRX</v-card-item>
              <v-card-item class="text-amber-accent-1"> Daily Bonus - 3% </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row class="content-wrapper">
          <v-col class="flex-lg-1-1-0 flex-sm-1-1-100">
            <v-card class="fill-height text-center first py-8" rounded min-width="200">
              <v-card-item>
                <v-card-title>{{ $t("Beginner") }}</v-card-title>
                <v-card-subtitle>{{ $t("Try and see - everything is possible") }}</v-card-subtitle>
              </v-card-item>
              <v-card-text class="text-h5">{{ $t("From {0} TRX", [100]) }}</v-card-text>
              <v-card-item class="text-center">
                <v-btn size="large" color="secondary" variant="flat" @click="showQRDialog = true">{{
                  $t("Invest now")
                }}</v-btn>
              </v-card-item>
              <v-card-item>
                <v-list lines="one" class="bg-transparent">
                  <v-list-item>{{ $t("Minimal - {0} TRX", [100]) }}</v-list-item>
                  <v-list-item>{{ $t("Interest - {0}%", [10]) }}</v-list-item>
                  <v-list-item>{{ $t("Term - {0} days", [20]) }}</v-list-item>
                </v-list>
              </v-card-item>
            </v-card>
          </v-col>
          <v-col class="flex-lg-1-1-0 flex-sm-1-1-100">
            <v-card class="fill-height text-center second pt-8" rounded min-width="200">
              <v-card-item>
                <v-card-title>{{ $t("Confident") }}</v-card-title>
                <v-card-subtitle>{{ $t("Invest with confidence - secure your future today!") }}</v-card-subtitle>
              </v-card-item>
              <v-card-text class="text-h5">{{ $t("From {0} TRX", [500]) }}</v-card-text>
              <v-card-item class="text-center">
                <v-btn size="large" color="secondary" variant="flat" @click="showQRDialog = true">{{
                  $t("Invest now")
                }}</v-btn>
              </v-card-item>
              <v-card-item>
                <v-list lines="one" class="bg-transparent">
                  <v-list-item>{{ $t("Minimal - {0} TRX", [500]) }}</v-list-item>
                  <v-list-item>{{ $t("Interest - {0}%", [20]) }}</v-list-item>
                  <v-list-item>{{ $t("Term - {0} days", [30]) }}</v-list-item>
                </v-list>
              </v-card-item>
            </v-card>
          </v-col>
          <v-col class="flex-lg-1-1-0 flex-sm-1-1-100">
            <v-card class="fill-height text-center third pt-8" min-width="200">
              <v-card-item>
                <v-card-title>{{ $t("Professional") }}</v-card-title>
                <v-card-subtitle>{{ $t("You know what you want!") }}</v-card-subtitle>
              </v-card-item>
              <v-card-text class="text-h5">{{ $t("From {0} TRX", [1000]) }}</v-card-text>
              <v-card-item class="text-center">
                <v-btn size="large" color="secondary" variant="flat" @click="showQRDialog = true">{{
                  $t("Invest now")
                }}</v-btn>
              </v-card-item>
              <v-card-item>
                <v-list lines="one" class="bg-transparent">
                  <v-list-item>{{ $t("Minimal - {0} TRX", [1000]) }}</v-list-item>
                  <v-list-item>{{ $t("Interest - {0}%", [30]) }}</v-list-item>
                  <v-list-item>{{ $t("Term - {0} days", [40]) }}</v-list-item>
                </v-list>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <v-card v-if="app.lang == 'ru'">
              <v-card-title class="text-h4 text-wrap">О нас</v-card-title>
              <v-card-text>
                Мы - команда инвесторов, трейдеров и ИТ-специалистов, объединенных общей целью - максимизировать
                потенциал финансовых рынков с помощью передовых технологий. Наша команда сочетает глубокие знания в
                области инвестиций и трейдинга с обширным опытом в информационных технологиях
              </v-card-text>
              <v-card-text>
                Мы используем искусственный интеллект и собственные алгоритмы трейдинга для разработки стратегий,
                которые позволяют эффективно анализировать рынки и принимать обоснованные решения. Наши уникальные
                алгоритмы обеспечивают точность и быстроту, что дает нам конкурентное преимущество в мире трейдинга.
              </v-card-text>
              <v-card-text>
                Наша миссия - поделиться возможностью зарабатывать на трейдинге с каждым, кто стремится к финансовой
                независимости. При этом мы сохраняем наши уникальные методики и секреты внутри команды, обеспечивая
                надежность и стабильность наших стратегий. Мы верим, что с помощью наших инновационных подходов и
                технологий каждый может достичь успеха на финансовых рынках.
              </v-card-text>
            </v-card>
            <v-card v-else>
              <v-card-title class="text-h4 text-wrap">About Us</v-card-title>
              <v-card-text>
                We are a team of investors, traders, and IT specialists united by a common goal – to maximize the
                potential of financial markets through advanced technologies. Our team combines deep knowledge in
                investment and trading with extensive experience in information technology
              </v-card-text>
              <v-card-text>
                We use artificial intelligence and proprietary trading algorithms to develop strategies that allow us to
                efficiently analyze markets and make informed decisions. Our unique algorithms ensure precision and
                speed, giving us a competitive edge in the trading world
              </v-card-text>
              <v-card-text>
                Our mission is to share the opportunity to earn from trading with everyone who strives for financial
                independence. At the same time, we keep our unique methodologies and secrets within the team, ensuring
                the reliability and stability of our strategies. We believe that with our innovative approaches and
                technologies, anyone can achieve success in the financial markets
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>

  <v-dialog v-model="showQRDialog" width="30%">
    <v-btn icon="mdi-close" @click="showQRDialog = false" />
    <v-sheet v-if="app.login" class="text-center pa-4">
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
    <v-sheet v-else class="text-center pa-4">
      <div class="text-h6">{{ $t("Log In First") }}</div>
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
import type { SubmitEventPromise } from "vuetify";

definePageMeta({
  layout: "clean",
});

const app = useAppStore();
const { copy, copied, isSupported } = useClipboard();
const { t } = useI18n();
const i18n = useI18n();
const theme = useTheme();
const rules = useValidationRules();

const cb = () => {
  i18n.locale.value = app.lang;
  theme.global.name.value = app.dark ? "dark" : "light";
};

app.$subscribe(() => cb());
onMounted(() => cb());

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

const siteLogin = async (event: SubmitEventPromise) => {
  if ((await event).valid) {
    await app.siteLogin();
  }
};

const send = () => {
  alert.value = "Minimal amount to send - 100 TRX";
  showSB.value = true;
};

setInterval(() => (app.counter2 += 34), 250);
</script>

<style scoped>
.first {
  color: #161a2e;
  background-color: #3eb8f9;
}

.second {
  color: #161a2e;
  background-color: #87e21f;
}

.third {
  color: #161a2e;
  background-color: #ffe121;
}

.ttt {
  min-width: 300px;
}
</style>
