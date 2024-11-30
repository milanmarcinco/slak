<template>
  <q-page>
    <AuthFormContainer>
      <h1 class="text-h4 text-center q-mb-sm">
        {{ $t('sign_in.title') }}
      </h1>

      <RouterLink :to="{ name: 'sign-up' }" class="block q-mb-lg text-center">
        {{ $t('sign_in.subtitle') }}
      </RouterLink>

      <a href="https://172.20.10.6:3333">https://172.20.10.6:3333</a>

      <q-form class="sign-in" @submit.prevent="handleSignIn">
        <q-input
          :label="$t('sign_in.fields.email.label')"
          v-model="email"
          standout
          :rules="emailRules"
        />

        <q-input
          type="password"
          :label="$t('sign_in.fields.password.label')"
          v-model="password"
          standout
          :rules="passwordRules"
        />

        <q-btn
          type="submit"
          color="primary"
          :label="$t('sign_in.action')"
          class="q-ml-auto q-mr-none block"
          :loading="loading"
        />
      </q-form>
    </AuthFormContainer>
  </q-page>
</template>

<script setup lang="ts">
import { ValidationRule } from 'quasar';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRouter } from 'vue-router';

import AuthFormContainer from 'components/auth/AuthFormContainer.vue';

import { useAuthStore } from 'src/stores/auth';

const { t } = useI18n();

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const emailRules: ValidationRule<string>[] = [
  (val) => !!val || t('sign_in.fields.email.validation.required'),
  'email',
];

const passwordRules: ValidationRule<string>[] = [
  (val) => !!val || t('sign_in.fields.password.validation.required'),
];

const handleSignIn = async () => {
  try {
    loading.value = true;
    error.value = false;

    await authStore.signIn({
      email: email.value,
      password: password.value,
    });

    const from = router.currentRoute.value.redirectedFrom;

    router.push(
      from || {
        name: 'index',
      }
    );
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const loading = ref(false);
const error = ref(false);

defineOptions({
  name: 'SignInPage',
});
</script>

<style lang="scss" scoped>
.sign-in {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
