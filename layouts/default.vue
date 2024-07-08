<template>
  <v-layout>
    <v-main class="h-screen">
      <NuxtPage />
    </v-main>
    <v-bottom-navigation>
      <v-btn to="/">
        <v-icon>mdi-home-outline</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn to="/wallet">
        <v-icon>mdi-wallet-outline</v-icon>
        <span>Wallet</span>
      </v-btn>
      <v-btn to="/investment">
        <v-icon>mdi-currency-usd</v-icon>
        <span>Invest</span>
      </v-btn>
      <v-btn to="/friends">
        <v-icon>mdi-account-multiple-outline</v-icon>
        <span>Friends</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
<script setup lang="ts"></script>
