<template>
  <div
    class="message"
    :class="{
      'message--sent': sent,
    }"
  >
    <div class="message__caption">{{ caption }}</div>
    <div class="message__content">{{ content }}</div>
  </div>
</template>

<script setup lang="ts">
const { author, content, createdAt, sent } = defineProps<{
  author: string;
  content: string;
  createdAt: string;
  sent?: boolean;
}>();

const datetime = new Date(createdAt).toLocaleString();
const caption = author + ' • ' + datetime;

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Message',
});
</script>

<style scoped lang="scss">
.message {
  width: max-content;
  max-width: calc(2 / 3 * 100%);

  & + & {
    margin-top: 12px;
  }

  &__caption {
    font-size: $font-xs;
  }

  &__content {
    padding: 6px 8px;
    margin-top: 2px;
    background-color: $dark;
    border-radius: 6px;
  }

  &--sent {
    margin-left: auto;

    .message {
      &__content {
        background-color: $primary;
      }
    }
  }
}
</style>
