<template>
  <div class="flex-grow text-center text-white text-2xl">
    <div class="mt-4">
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

  <div class="w-full flex flex-row content-between align-middle justify-between px-2">
    <div class="inline-flex flex-row">
      <div class="trx-bg w-16 h-16 m-0 p-0 flex justify-center items-center">
        <Icon name="cppx:trx-logo" class="w-12 h-12 m-0 p-0 flex-grow text-gray-50 dark:text-gray-50" />
      </div>
      <div>
        <span class="text-gray-500">Tron Balance</span>
        <br />
        <span class="text-2xl text-white">100 TRX</span>
      </div>
    </div>
    <div class="inline-flex text-white">
      <button
        type="button"
        class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
      >
        Send
      </button>
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
