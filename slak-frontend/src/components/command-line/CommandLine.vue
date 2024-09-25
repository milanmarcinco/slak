<template>
  <div class="command-line">
    <div
      v-if="mentions.length"
      class="command-line__mentions q-pa-sm q-mb-sm rounded-borders"
    >
      <q-chip
        v-for="user of mentions"
        @remove="handleRemoveMention(user.id)"
        class="q-ma-none"
        color="orange-6"
        square
        dense
        removable
        :key="user.id"
      >
        {{ `${user.firstName} ${user.lastName}` }}
      </q-chip>
    </div>

    <form
      @submit="handleSubmit"
      class="bg-dark rounded-borders relative-position"
    >
      <MentionPicker
        :is-open="mentionSelectVisible"
        @select-mention="handleSelectMention"
        @dismiss="handleDismissMention"
      />

      <q-input
        v-model="value"
        @keypress="handleKeyPress"
        class="command-line__input"
        :ref="COMMAND_LINE_REF"
        type="text"
        standout
        autogrow
        dense
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
            @click="handleSubmit"
          />
        </template>
      </q-input>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCommandLine } from 'composables/useCommandLine';

import MentionPicker from './MentionPicker.vue';

import { User } from '../models';

const COMMAND_LINE_REF = 'command-line';

const { t } = useI18n();

const value = ref('');
const mentions = ref<User[]>([]);

const mentionSelectVisible = ref(false);
const commandLineRef = useTemplateRef<HTMLInputElement>(COMMAND_LINE_REF);

const { isCommandMode, execCommand } = useCommandLine(value);

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === '@') {
    mentionSelectVisible.value = true;
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

const handleSelectMention = (user: User) => {
  mentions.value = [...mentions.value, user];
  mentionSelectVisible.value = false;
  value.value = value.value.slice(0, -1);
  commandLineRef.value?.focus();
};

const handleRemoveMention = (userId: User['id']) => {
  mentions.value = mentions.value.filter((user) => user.id !== userId);
};

const handleDismissMention = () => {
  mentionSelectVisible.value = false;
  commandLineRef.value?.focus();
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
    gap: 8px;

    background-color: $dark;

    .q-chip {
      font-size: $font-xs;
    }
  }
}
</style>
