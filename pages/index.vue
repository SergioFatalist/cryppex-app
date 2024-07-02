<template>
  <div class="text-white text-2xl">
    Hello
    <br />
    {{ $app.$state.user?.username || `${$app.$state.user?.first_name} ${$app.$state.user?.last_name} ` }}
  </div>
</template>

<script setup lang="ts">
const $app = useAppStore();

// const load = async () => {
//   try {
//
//   } catch (e) {
//     console.log(e);
//   }
// }
</script>
