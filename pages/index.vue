<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <span class="text-subtitle-2">Hello</span>
        <br />
        <span class="text-h6 text-white">
          {{ formatTgName($app.user) }}
        </span>
      </v-col>
    </v-row>
  </v-container>
  <trx-balance />
</template>

<script setup lang="ts">
import TrxBalance from "~/components/TrxBalance.vue";

const $app = useAppStore();
</script>
