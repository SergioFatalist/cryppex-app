<template>
  <div class="flex flex-row">
    <div class="trx-bg w-12 h-12 m-0 p-0 flex justify-center items-center">
      <Icon name="cppx:trx-logo" class="w-10 h-10 m-0 p-0 flex-grow text-gray-50 dark:text-gray-50" />
    </div>
  </div>
  <div class="flex-grow text-center text-white text-2xl border-2 dark:border-blue-400">
    <div>
      <span class="text-xl">Hello</span>
      <br />
      <span v-if="$app.$state.user?.username">
        <span class="text-gray-600">@</span>{{ $app.$state.user?.username }}
      </span>
      <span v-else>
        {{ `${$app.$state.user?.first_name} ${$app.$state.user?.last_name}` }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const $app = useAppStore();
</script>

<style>
.trx-bg {
  background-image: url("assets/icons/redg.svg");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
</style>
