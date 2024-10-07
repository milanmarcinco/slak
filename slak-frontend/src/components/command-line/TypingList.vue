<template>
  <div v-if="users && users.length" class="typing-list q-pa-sm">
    <template v-for="(user, idx) in splitUsers.rest" :key="user.id">
      {{ idx === 0 ? null : ', ' }}

      <button class="typing-list__user">
        {{ user.nickName }}
      </button>
    </template>

    <template v-if="splitUsers.last">
      {{ splitUsers.rest.length ? ` ${$t('common.and')}` : null }}

      <button class="typing-list__user">
        {{ splitUsers.last.nickName }}
      </button>
    </template>

    {{ $t('messages.typing', users.length) }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { User } from '../models';

const { users } = defineProps<{
  users: User[] | null;
}>();

const splitUsers = computed<{
  rest: User[];
  last: User | null;
}>(() => {
  if (!users || !users.length) {
    return {
      rest: [],
      last: null,
    };
  }

  if (users.length === 1) {
    return {
      rest: [],
      last: users[0],
    };
  }

  return {
    rest: users.slice(0, -1),
    last: users[users.length - 1],
  };
});
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
