// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "nitro-cloudflare-dev",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/i18n",
    "vuetify-nuxt-module",
  ],
  nitro: {
    preset: "cloudflare",
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  ssr: false,
  build: {
    transpile: ["vuetify", "trpc-nuxt"],
  },
  runtimeConfig: {
    botToken: process.env.NUXT_BOT_TOKEN,
  },
  i18n: {
    lazy: true,
    strategy: "no_prefix",
    dynamicRouteParams: false,
    skipSettingLocaleOnNavigate: true,
    langDir: "./i18n",
    locales: [
      {
        code: "en-US",
        iso: "en-US",
        file: "en-US.json",
        name: "English",
      },
      {
        code: "ru-RU",
        iso: "ru-RU",
        file: "ru-RU.json",
        name: "Russian",
      },
    ],
    detectBrowserLanguage: {
      useCookie: false,
      fallbackLocale: "en",
    },
    vueI18n: "./i18n.config.ts",
  },
  vuetify: {
    moduleOptions: {
      includeTransformAssetsUrls: false,
    },
    vuetifyOptions: {
      icons: {
        defaultSet: "mdi",
      },
      theme: {
        themes: {
          dark: {
            dark: true,
            colors: {
              background: "#232b43",
              // 'background': '#0C0F16',
              surface: "#161A2E",
              "surface-bright": "#3D52A0",
              "surface-light": "#232b43",
              // 'surface-variant': '#0C0F16',
              "on-surface-variant": "#EEEEEE",
              primary: "#3366FF",
              secondary: "#254EDB",
              error: "#FF652D",
              info: "#3EB8F9",
              success: "#87E21F",
              warning: "#FFE121",
            },
          },
        },
        defaultTheme: "dark",
      },
    },
  },
  app: {
    head: {
      script: [{ src: "https://telegram.org/js/telegram-web-app.js" }],
    },
  },
  vite: {
    server: {
      hmr: {
        overlay: false,
        protocol: "wss",
      },
    },
  },
  devServer: {
    host: "0.0.0.0",
    port: 4200,
  },
});
