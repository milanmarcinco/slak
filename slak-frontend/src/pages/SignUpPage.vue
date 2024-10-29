<template>
  <q-page>
    <AuthFormContainer>
      <h1 class="text-h4 text-center q-mb-sm">
        {{ $t('sign_up.title') }}
      </h1>

      <RouterLink :to="{ name: 'sign-in' }" class="block q-mb-lg text-center">
        {{ $t('sign_up.subtitle') }}
      </RouterLink>

      <q-form class="sign-up" @submit.prevent="handleSignUp">
        <q-input
          :label="$t('sign_up.fields.nick_name.label')"
          v-model="nickName"
          standout
          :rules="nickNameRules"
        />

        <div class="sign-up__columns">
          <q-input
            :label="$t('sign_up.fields.first_name.label')"
            v-model="firstName"
            standout
            :rules="firstNameRules"
          />

          <q-input
            :label="$t('sign_up.fields.last_name.label')"
            v-model="lastName"
            standout
            :rules="lastNameRules"
          />
        </div>

        <q-input
          :label="$t('sign_up.fields.email.label')"
          v-model="email"
          standout
          :rules="emailRules"
        />

        <div class="sign-up__columns">
          <q-input
            type="password"
            :label="$t('sign_up.fields.password.label')"
            v-model="password"
            standout
            :rules="passwordRules"
          />

          <q-input
            type="password"
            :label="$t('sign_up.fields.password_repeat.label')"
            v-model="passwordRepeat"
            standout
            :rules="passwordRepeatRules"
          />
        </div>

        <q-btn
          type="submit"
          color="primary"
          :label="$t('sign_up.action')"
          class="q-ml-auto q-mr-none block"
        />
      </q-form>
    </AuthFormContainer>
  </q-page>
</template>

<script setup lang="ts">
import { ValidationRule } from 'quasar';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import AuthFormContainer from 'components/auth/AuthFormContainer.vue';

import { useMainStore } from 'stores/main';

const { t } = useI18n();

const mainStore = useMainStore();
const router = useRouter();

const nickName = ref('');
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordRepeat = ref('');

const nickNameRules: ValidationRule<string>[] = [
  (val) => !!val || t('sign_up.fields.nick_name.validation.required'),
  (val) => val.length > 3 || t('sign_up.fields.nick_name.validation.min'),
  (val) => val.length < 30 || t('sign_up.fields.nick_name.validation.max'),
];

const firstNameRules: ValidationRule<string>[] = [
  (val) => !!val || t('sign_up.fields.first_name.validation.required'),
  (val) => val.length > 2 || t('sign_up.fields.first_name.validation.min'),
  (val) => val.length < 30 || t('sign_up.fields.first_name.validation.max'),
];

const lastNameRules: ValidationRule<string>[] = [
  (val) => !!val || t('sign_up.fields.last_name.validation.required'),
  (val) => val.length > 2 || t('sign_up.fields.last_name.validation.min'),
  (val) => val.length < 30 || t('sign_up.fields.last_name.validation.max'),
];

const emailRules: ValidationRule<string>[] = [
  (val) => !!val || t('sign_up.fields.email.validation.required'),
  'email',
];

const passwordRules: ValidationRule<string>[] = [
  (val) => !!val || t('sign_up.fields.password.validation.required'),
];

const passwordRepeatRules: ValidationRule<string>[] = [
  (val) =>
    val === password.value ||
    t('sign_up.fields.password_repeat.validation.no_match'),
];

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

<style lang="scss" scoped>
.sign-up {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  .sign-up__columns {
    display: flex;
    gap: 1rem;

    & > * {
      flex: 1;
    }
  }
}
</style>
