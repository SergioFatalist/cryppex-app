import VueTelegram from "vue-tg";

export default defineNuxtPlugin((app) => {
  app.vueApp.use(VueTelegram);
});
