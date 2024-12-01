<template>
  <q-page class="q-px-sm column items-center justify-center">
    <h2 class="text-h4 text-center">You are offline! 💔</h2>

    <p class="text-center q-mb-xl">
      To chat with the world, make sure you are connected to the internet.
    </p>

    <q-btn color="primary" @click="handleTryAgain">Try again</q-btn>
  </q-page>
</template>

<script setup lang="ts">
const handleTryAgain = async () => {
  window.location.reload();
};

defineOptions({
  name: 'OfflinePage',
});
</script>
