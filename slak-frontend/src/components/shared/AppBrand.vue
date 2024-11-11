<template>
  <div
    @click="chatStore.togglePrivacyMode"
    class="app-brand row items-center non-selectable"
    :class="{
      'app-brand--glow': !chatStore.privacyMode,
    }"
    tabindex="0"
  >
    <q-avatar>
      <SlakLogo :glow="!chatStore.privacyMode" white />
    </q-avatar>

    <span class="app-brand__name">{{ $t('title') }}</span>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from 'stores/chat';

import SlakLogo from './SlakLogo.vue';

const chatStore = useChatStore();
</script>

<style scoped lang="scss">
.app-brand {
  display: inline-block;
  cursor: pointer;

  &__name {
    margin-left: 0.25rem;

    font-size: 1rem;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;

    transition: 150ms text-shadow ease-in-out;
  }

  &:focus-visible {
    outline: none;
  }

  &--glow {
    .app-brand {
      &__name {
        text-shadow: 0px 0px 16px rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>
