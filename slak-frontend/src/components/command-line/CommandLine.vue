<template>
  <div class="command-line">
    <q-input v-model="message" standout autogrow class="command-line__input" />

    <q-btn
      color="primary"
      :label="t('command_line.send')"
      class="command-line__button"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const message = ref('');

defineOptions({
  name: 'CommandLine',
});
</script>

<style scoped lang="scss">
.command-line {
  display: flex;
  gap: 8px;

  &__input {
    flex-grow: 1;
  }
}
</style>
