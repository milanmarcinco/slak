<template>
  <div class="command-line">
    <TypingList :users="users.slice(0, 3)" />

    <div
      v-if="mentions.length"
      class="command-line__mentions q-pa-sm q-mb-sm rounded-borders bg-dark"
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
            :disabled="isCommandMode && !isValidCommand"
            @click="handleSubmit"
          />
        </template>
      </q-input>
    </form>
  </div>

  <ChannelUsersList
    :is-open="channelUsersListIsOpen"
    @close="channelUsersListIsOpen = false"
    :channel-id="activeChannelId"
  />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { useActiveChannelId } from 'composables/useActiveChannelId';
import { useCommandLine } from 'composables/useCommandLine';

import { useMainStore } from 'stores/main';
import users from 'stores/seed/users.json';

import MentionPicker from './MentionPicker.vue';
import TypingList from './TypingList.vue';

import ChannelUsersList from 'components/channels/ChannelUsersList.vue';

import { User } from '../models';

const COMMAND_LINE_REF = 'command-line';

const { t } = useI18n();

const value = ref('');
const mentions = ref<User[]>([]);

const mentionSelectVisible = ref(false);
const commandLineRef = useTemplateRef<HTMLInputElement>(COMMAND_LINE_REF);

const channelUsersListIsOpen = ref(false);
const activeChannelId = useActiveChannelId();

const mainStore = useMainStore();

const { isCommandMode, isValidCommand, execCommand } = useCommandLine({
  text: value,
  onList: () => (channelUsersListIsOpen.value = true),
});

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === '@') {
    mentionSelectVisible.value = true;
  }

  if (!event.shiftKey && event.key === 'Enter') {
    event.preventDefault();
    handleSubmit(event);
  }
};

const handleSubmit = (event: Event) => {
  event.preventDefault();

  const input = value.value.trim();
  if (!input) return;

  if (isCommandMode.value) {
    if (!isValidCommand.value) {
      return;
    }

    execCommand();
  } else {
    if (!activeChannelId.value) return;
    mainStore.sendMessage(activeChannelId.value, input);
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

    .q-chip {
      font-size: $font-xs;
    }
  }
}
</style>
