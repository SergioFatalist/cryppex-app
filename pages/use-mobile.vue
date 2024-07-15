<template>
  <div class="h-screen">
    <div class="d-block h-100">
      <div class="d-flex flex-column justify-space-between h-100">
        <v-spacer />
        <div class="text-white text-center text-h5">Use Mobile Device</div>
        <div class="text-center my-4">
          <qr-code :value="url" :background="'#161a2e'" :foreground="'#ffffff'" :size="200" level="H" render-as="svg" />
        </div>
        <v-spacer />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

const startParam = route.query["start_param"];

const url = ref(startParam ? `${config.public.appUrl}?startapp=${startParam}` : config.public.appUrl);
</script>
