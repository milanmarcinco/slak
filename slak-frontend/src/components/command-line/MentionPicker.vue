<template>
  <div class="mention-picker bg-dark rounded-borders q-pa-md">
    <q-list class="mention-picker__list overflow-auto" dense>
      <q-item
        v-for="(user, idx) in filteredUsers"
        @mouseover="selectedIdx = idx"
        @click="handleSelect"
        class="mention-picker__item rounded-borders"
        active-class="mention-picker__item--selected"
        :active="idx === selectedIdx"
        :key="user.id"
        clickable
        v-ripple
      >
        <q-item-section>
          <span class="mention-picker__label">
            <span class="text-weight-bold">
              {{ `${user.firstName} ${user.lastName}` }}
            </span>

            <span>•</span>

            <span class="mention-picker__label--caption">
              {{ user.nickName }}
            </span>
          </span>
        </q-item-section>
      </q-item>

      <p
        v-if="!filteredUsers.length"
        class="mention-picker__empty-message q-ma-none"
      >
        {{ $t('mentions.no_users') }}
      </p>
    </q-list>

    <q-input
      ref="mention-picker-input"
      v-model="value"
      @keydown="handleKeyPress"
      class="q-mt-md"
      type="text"
      standout
      dense
    />
  </div>
</template>

<script setup lang="ts">
import { QInput } from 'quasar';
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

import { clampNumber } from 'lib/helpers';

import { User } from '../models';

import dummyUsers from 'stores/seed/users.json';

const START_IDX = 0;

const emit = defineEmits<{
  selectMention: [user: User];
  dismiss: [];
}>();

const value = ref<string>('');
const selectedIdx = ref<number>(0);

const users = ref<User[]>(dummyUsers as User[]);

const filteredUsers = computed(() =>
  users.value
    .filter((user) =>
      (user.firstName + user.lastName + user.nickName)
        .toLowerCase()
        .includes(value.value.toLowerCase())
    )
    .slice(0, 5)
);

const reset = () => {
  value.value = '';
  selectedIdx.value = START_IDX;
};

const handleSelect = () => {
  const user = filteredUsers.value[selectedIdx.value];
  emit('selectMention', user);
  reset();
};

const handleDismiss = () => {
  emit('dismiss');
  reset();
};

const handleKeyPress = (event: KeyboardEvent) => {
  const key = event.key;

  switch (key) {
    case 'Tab':
    case 'Escape':
      handleDismiss();
      break;
    case 'Enter':
      event.preventDefault();
      handleSelect();
      break;
    case 'ArrowUp':
      selectedIdx.value = clampNumber(
        selectedIdx.value - 1,
        START_IDX,
        filteredUsers.value.length
      );
      break;
    case 'ArrowDown':
      selectedIdx.value = clampNumber(
        selectedIdx.value + 1,
        START_IDX,
        filteredUsers.value.length
      );
      break;
    default:
      selectedIdx.value = START_IDX;
      break;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (!event.target) return;

  const target = event.target as HTMLElement;

  if (!target.closest('.mention-picker')) {
    handleDismiss();
  }
};

const mentionPickerInput = useTemplateRef<QInput>('mention-picker-input');

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  if (!mentionPickerInput.value) return;
  setTimeout(() => mentionPickerInput.value!.focus());
});

onUnmounted(() => document.removeEventListener('click', handleClickOutside));

defineOptions({
  name: 'MentionPicker',
});
</script>

<style scoped lang="scss">
.mention-picker {
  width: 100%;
  max-height: 300px;

  display: flex;
  flex-direction: column;

  position: absolute;
  top: -16px;
  left: 0;

  transform: translateY(-100%);

  &__list {
    flex-grow: 1;
  }

  &__item {
    cursor: pointer;

    & + & {
      margin-top: 2px;
    }

    &--selected {
      background-color: lighten($color: $dark, $amount: 10%);
    }
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 6px;

    &--caption {
      font-size: $font-xs;
      color: $light;
    }
  }

  &__empty-message {
    font-size: $font-xs;
    color: $light;
  }
}
</style>
