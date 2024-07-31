<template>
  <v-layout>
    <v-main>
      <NuxtPage />
    </v-main>
    <v-bottom-navigation>
      <v-btn to="/app">
        <v-icon>mdi-home-outline</v-icon>
        <span>{{ $t("Home") }}</span>
      </v-btn>
      <v-btn to="/app/wallet">
        <v-icon>mdi-wallet-outline</v-icon>
        <span>{{ $t("Wallet") }}</span>
      </v-btn>
      <v-btn to="/app/friends">
        <v-icon>mdi-account-multiple-outline</v-icon>
        <span>{{ $t("Friends") }}</span>
      </v-btn>
      <v-btn to="/app/investment">
        <v-icon>mdi-currency-usd</v-icon>
        <span>{{ $t("Interests") }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
<script setup lang="ts"></script>
