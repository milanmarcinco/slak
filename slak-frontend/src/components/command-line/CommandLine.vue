<template>
  <div class="command-line">
    <TypingList />

    <div
      v-if="mentions.size"
      class="command-line__mentions q-pa-sm q-mb-sm rounded-borders bg-dark"
    >
      <q-chip
        v-for="[, user] of mentions"
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
        v-if="mentionSelectVisible"
        :is-open="mentionSelectVisible"
        :mentions="mentions"
        @select-mention="handleSelectMention"
        @dismiss="handleDismissMention"
      />

      <q-input
        v-model="message"
        @keydown="handleKeyDown"
        @keyup="handleKeyUp"
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
import { ref, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useActiveChannelId } from 'composables/useActiveChannelId';
import { useCommandLine } from 'composables/useCommandLine';

import MentionPicker from './MentionPicker.vue';
import TypingList from './TypingList.vue';

import ChannelUsersList from 'components/channels/ChannelUsersList.vue';

import { useChatStore } from 'stores/chat';

import { User } from 'src/contracts';

const COMMAND_LINE_REF = 'command-line';

const { t } = useI18n();

const message = ref('');
const mentions = ref<Map<number, User>>(new Map());

const mentionSelectVisible = ref(false);
const commandLineRef = useTemplateRef<HTMLInputElement>(COMMAND_LINE_REF);

const channelUsersListIsOpen = ref(false);
const activeChannelId = useActiveChannelId();

const chatStore = useChatStore();

const { isCommandMode, isValidCommand, execCommand } = useCommandLine({
  text: message,
  onList: () => (channelUsersListIsOpen.value = true),
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === '@') {
    if (!activeChannelId.value) return;
    mentionSelectVisible.value = true;
  }

  if (!event.shiftKey && event.key === 'Enter') {
    event.preventDefault();
    handleSubmit(event);
  }
};

const handleKeyUp = () => {
  if (!activeChannelId.value) return;

  const content = message.value.trim() || null;
  chatStore.sendTyping(activeChannelId.value, content);
};

const handleSubmit = (event: Event) => {
  event.preventDefault();

  const content = message.value.trim();
  if (!content) return;

  if (isCommandMode.value) {
    if (!isValidCommand.value) {
      return;
    }

    execCommand();
  } else {
    if (!activeChannelId.value) return;

    const mentionIds = Array.from(mentions.value.keys());
    chatStore.sendMessage(activeChannelId.value, content, mentionIds);
  }

  mentions.value.clear();
  message.value = '';
};

const handleSelectMention = (user: User) => {
  mentions.value.set(user.id, user);
  mentionSelectVisible.value = false;
  message.value = message.value.slice(0, -1);
  commandLineRef.value?.focus();
};

const handleRemoveMention = (userId: User['id']) => {
  mentions.value.delete(userId);
};

const handleDismissMention = () => {
  mentionSelectVisible.value = false;
  commandLineRef.value?.focus();
};

watch(activeChannelId, (_, oldId) => {
  mentions.value.clear();
  message.value = '';

  if (oldId) {
    chatStore.sendTyping(oldId, null);
  }
});

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
