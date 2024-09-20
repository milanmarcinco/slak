<template>
  <div class="command-line">
    <div
      v-if="mentions.length"
      class="command-line__mentions q-pa-sm q-mb-sm rounded-borders"
    >
      <q-chip
        v-for="mention of mentions"
        class="q-ma-none"
        color="orange-6"
        square
        dense
        removable
        :key="mention"
      >
        {{ mention }}
      </q-chip>
    </div>

    <form @submit="handleSubmit" class="bg-dark rounded-borders">
      <q-input
        v-model="value"
        @keypress="handleKeyPress"
        type="text"
        standout
        autogrow
        dense
        class="command-line__input"
      >
        <template #append>
          <q-btn
            push
            size="sm"
            class="command-line__button"
            :color="isCommandMode ? 'red-14' : 'primary'"
            :label="
              isCommandMode ? t('command_line.execute') : t('command_line.send')
            "
          />
        </template>
      </q-input>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCommandLine } from 'composables/useCommandLine';

const { t } = useI18n();

const value = ref('');
const mentions = ref<string[]>([]);

const { isCommandMode, execCommand } = useCommandLine(value);

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === '@') {
    // Handle mention
  }

  if (!event.shiftKey && event.key === 'Enter') {
    event.preventDefault();
    handleSubmit(event);
  }
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  const input = value.value.trim();
  if (!input) return;

  if (isCommandMode) {
    await execCommand();
  } else {
    // Handle message
  }

  mentions.value = [];
  value.value = '';
};

defineOptions({
  name: 'CommandLine',
});
</script>

<style scoped lang="scss">
.command-line {
  &__button {
    transition: background-color 200ms ease-in-out;
  }

  &__mentions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    background-color: $dark;

    .q-chip {
      font-size: $font-xs;
    }
  }
}
</style>
