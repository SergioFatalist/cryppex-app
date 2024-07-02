<template>
  <div class="min-h-screen bg-gray-400 dark:bg-gray-950">
    <NuxtPage />

    <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-gray-400 dark:bg-black">
      <div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        <button
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-950 dark:hover:bg-gray-950 group"
        >
          <Icon
            name="ic:baseline-home"
            class="w-8 h-8 mb-0 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          />
          <span
            class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            >Wallet</span
          >
        </button>
        <button
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-950 dark:hover:bg-gray-950 group"
        >
          <Icon
            name="ic:baseline-account-balance-wallet"
            class="w-8 h-8 mb-0 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          />
          <span
            class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            >Wallet</span
          >
        </button>
        <button
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-950 dark:hover:bg-gray-950 group"
        >
          <Icon
            name="ic:outline-group"
            class="w-8 h-8 mb-0 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          />
          <span
            class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            >Referrals</span
          >
        </button>
      </div>
    </div>
  </div>
</template>
