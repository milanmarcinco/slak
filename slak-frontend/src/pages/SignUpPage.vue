<template>
  <q-page>
    <AuthFormContainer>
      <q-btn
        color="primary"
        :label="$t('sign_up.action')"
        @click="handleSignUp"
      />
    </AuthFormContainer>
  </q-page>
</template>

<script setup lang="ts">
import AuthFormContainer from 'components/auth/AuthFormContainer.vue';
import { useMainStore } from 'stores/main';
import { useRouter } from 'vue-router';

const mainStore = useMainStore();
const router = useRouter();

const handleSignUp = () => {
  mainStore.signUp();

  const from = router.currentRoute.value.redirectedFrom;

  const defaultFrom = {
    name: 'index',
  };

  router.push(from || defaultFrom);
};

defineOptions({
  name: 'SignUpPage',
});
</script>
