<template>
  <router-view v-if="!mainStore.initializing" />

  <AuthFormContainer>
    <div v-if="mainStore.initializing">Loading...</div>
  </AuthFormContainer>
</template>

<script setup lang="ts">
import AuthFormContainer from './components/auth/AuthFormContainer.vue';
import { useMainStore } from './stores/main';

const mainStore = useMainStore();

setTimeout(() => (mainStore.initializing = false), 1000);

defineOptions({
  name: 'App',
});
</script>
