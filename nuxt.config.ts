// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "vuetify-nuxt-module"],
  ssr: false,
  srcDir: "src/",
  debug: false,
  runtimeConfig: {
    public: {
      appUrl: process.env.PUBLIC_APP_URL,
      regBonusAbsolute: 10_000_000,
      sendFeeAbsolute: 3_000_000,
      topBonusPercent: 5,
    },
    tron: {
      fullHost: process.env.TRON_FULL_HOST,
      privateKey: process.env.TRON_PRIVATE_KEY,
      apiKey: process.env.TRON_API_KEY,
    },
    bot: {
      token: process.env.BOT_TOKEN,
    },
  },
  app: {
    head: {
      script: [
        {
          src: "https://telegram.org/js/telegram-web-app.js",
          defer: false,
        },
      ],
    },
  },
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: "mdi",
      },
      theme: {
        themes: {
          light: {
            dark: false,
            colors: {
              background: "#232b43",
              surface: "var(--tg-theme-bg-color)",
              "surface-bright": "#3D52A0",
              "surface-light": "#232b43",
              "on-surface-variant": "#EEEEEE",
              primary: "#3366FF",
              secondary: "var(--tg-theme-secondary-bg-color)",
              error: "#FF652D",
              info: "#3EB8F9",
              success: "#87E21F",
              warning: "#FFE121",
            },
          },
          dark: {
            dark: true,
            colors: {
              background: "#232b43",
              surface: "#161A2E",
              "surface-bright": "#3D52A0",
              "surface-light": "#232b43",
              "on-surface-variant": "#EEEEEE",
              primary: "#3366FF",
              secondary: "#3D52A0",
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
  nitro: {
    debug: true,
    logLevel: 1,
  },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    server: {
      ws: false,
      hmr: {
        overlay: false,
      },
    },
  },
  devtools: {
    enabled: false,
  },
  devServer: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "4200") || 4200,
  },
  typescript: {
    typeCheck: true,
  },
  compatibilityDate: "2024-07-02",
});
