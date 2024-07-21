import QrcodeVue from "qrcode.vue";

export default defineNuxtPlugin((app) => {
  app.vueApp.component("qr-code", QrcodeVue);
});
