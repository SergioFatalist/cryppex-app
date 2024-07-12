<template>
  <div class="h-screen">
    <div class="d-block h-100">
      <div class="d-flex flex-column justify-space-between h-100">
        <v-spacer />
        <div class="text-white text-center text-h5">No Required DATA<br />Please close and open Application again</div>
        {{ app.user }}
        <v-spacer />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const app = useAppStore();
</script>
