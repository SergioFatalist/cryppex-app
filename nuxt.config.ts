// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
    },
    tron: {
      fullHost: process.env.NUXT_TRON_FULL_HOST,
      privateKey: process.env.NUXT_TRON_PRIVATE_KEY,
      apiKey: process.env.NUXT_TRON_API_KEY,
    },
    botToken: process.env.NUXT_BOT_TOKEN,
  },
  modules: ["@vueuse/nuxt", "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "vuetify-nuxt-module"],
  ssr: false,
  app: {
    head: {
      script: [{ src: "https://telegram.org/js/telegram-web-app.js" }],
    },
  },
  build: {
    transpile: ["vuetify", "trpc-nuxt"],
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
              surface: "#ADBBDA",
              "surface-bright": "#7091E6",
              "surface-light": "#8697C4",
              primary: "#3366FF",
              secondary: "#7091E6",
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
              // 'background': '#0C0F16',
              surface: "#161A2E",
              "surface-bright": "#3D52A0",
              "surface-light": "#232b43",
              // 'surface-variant': '#0C0F16',
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
  compatibilityDate: "2024-07-02",
});
