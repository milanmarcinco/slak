<template>
  <router-view v-if="!authStore.loading" />

  <AuthFormContainer>
    <div v-if="authStore.loading" class="text-center">
      <q-spinner color="primary" size="3rem" />
    </div>
  </AuthFormContainer>
</template>

<script setup lang="ts">
import AuthFormContainer from './components/auth/AuthFormContainer.vue';
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();

defineOptions({
  name: 'App',
});
</script>
