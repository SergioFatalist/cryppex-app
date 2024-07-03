import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      testVar: process.env.NUXT_TEST_VAR,
    },
    botToken: process.env.NUXT_BOT_TOKEN,
  },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "@nuxtjs/google-fonts", "@nuxt/icon"],
  googleFonts: {
    families: {
      Roboto: [300, 400, 500, 700],
    },
  },
  css: [join(currentDir, "./assets/css/main.css")],
  icon: {
    class: "icon",
    size: "32px",
    customCollections: [
      {
        prefix: "cppx",
        dir: "./assets/icons",
      },
    ],
  },
  ssr: false,
  app: {
    head: {
      script: [{ src: "https://telegram.org/js/telegram-web-app.js" }],
    },
  },
  build: {
    transpile: ["trpc-nuxt"],
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
