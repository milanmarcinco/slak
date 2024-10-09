<template>
  <q-page>
    <AuthFormContainer>
      <q-btn
        color="primary"
        :label="$t('sign_in.action')"
        @click="handleSignIn"
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

const handleSignIn = () => {
  mainStore.signIn();

  const from = router.currentRoute.value.redirectedFrom;

  const defaultFrom = {
    name: 'index',
  };

  router.push(from || defaultFrom);
};

defineOptions({
  name: 'SignInPage',
});
</script>
