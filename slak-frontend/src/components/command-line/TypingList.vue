<template>
  <div v-if="users && users.length" class="typing-list q-pa-sm">
    <template v-for="(user, idx) in splitUsers.rest" :key="user.id">
      {{ idx === 0 ? null : ', ' }}

      <button class="typing-list__user" @click="handleSelectTypingUser(user)">
        {{ user.nickName }}
      </button>
    </template>

    <template v-if="splitUsers.last">
      {{ splitUsers.rest.length ? ` ${$t('common.and')}` : null }}

      <button
        class="typing-list__user"
        @click="handleSelectTypingUser(splitUsers.last)"
      >
        {{ splitUsers.last.nickName }}
      </button>
    </template>

    {{ $t('messages.typing', users.length) }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useActiveChannelId } from 'composables/useActiveChannelId';
import { useChatStore } from 'stores/chat';
import { useUserStore } from 'stores/user';
import { User } from 'src/contracts';

const chatStore = useChatStore();
const userStore = useUserStore();
const activeChannelId = useActiveChannelId();

const users = computed(() => {
  const typingChannel = chatStore.typing[activeChannelId.value!];

  if (!typingChannel) {
    return [];
  }

  const userIds = Object.keys(typingChannel) as unknown as number[];
  const users = userIds.map((userId) => userStore.users[userId]);

  return users;
});

const splitUsers = computed<{
  rest: User[];
  last: User | null;
}>(() => {
  if (!users.value || !users.value.length) {
    return {
      rest: [],
      last: null,
    };
  }

  if (users.value.length === 1) {
    return {
      rest: [],
      last: users.value[0],
    };
  }

  return {
    rest: users.value.slice(0, -1),
    last: users.value[users.value.length - 1],
  };
});

const handleSelectTypingUser = (user: User) => {
  chatStore.setTypingUser(user);
};
</script>

<style lang="scss" scoped>
.typing-list {
  line-height: 1;
  font-size: $font-xs;
  color: $light;

  &__user {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;

    color: lighten($light, 10%);
    font-weight: bold;
    cursor: pointer;

    padding: 0;
    margin: 0;

    transition: 100ms color ease-in-out;

    background-color: transparent;
    border: none;

    &:focus-visible {
      color: $white;
      outline: none;
    }

    &:hover {
      color: $primary;
    }
  }
}
</style>
