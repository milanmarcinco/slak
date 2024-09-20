<template>
  <div class="message" :class="{ 'message-sent': sent }">
    <div class="message__author">{{ author }}</div>
    <div class="message__content">{{ content }}</div>
  </div>
</template>

<script setup lang="ts">
const { author, content, sent } = defineProps<{
  author: string;
  content: string;
  sent?: boolean;
}>();

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Message',
});
</script>

<style scoped lang="scss">
.message {
  width: max-content;
  max-width: calc(2 / 3 * 100%);

  &__author {
    font-size: $font-xs;
  }

  &__content {
    padding: 8px;
    margin-top: 2px;
    background-color: $dark;
    border-radius: 6px;
  }

  &-sent {
    margin-left: auto;

    .message {
      &__content {
        background-color: $primary;
      }
    }
  }
}
</style>
