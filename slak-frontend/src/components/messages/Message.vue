<template>
  <div
    class="message"
    :class="{
      'message--sent': sent,
      'message--preview': preview,
    }"
  >
    <div class="message__caption">{{ caption }}</div>
    <div class="message__content">{{ content }}</div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { author, content, createdAt, preview, sent } = defineProps<{
  author: string;
  content: string;
  createdAt: string;
  preview?: boolean;
  sent?: boolean;
}>();

const { t } = useI18n();

const datetime = new Date(createdAt).toLocaleString();

const caption = preview
  ? `${author} ${t('messages.typing')}`
  : `${author} • ${datetime}`;

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
    width: max-content;

    padding: 6px 8px;
    margin-top: 2px;
    
    background-color: $dark;
    border-radius: 6px;
  }

  &--sent {
    margin-left: auto;

    .message {
      &__content {
        margin-left: auto;
        background-color: $primary;
      }
    }
  }

  &--preview {
    .message {
      &__caption,
      &__content {
        color: $light;
      }
    }
  }
}
</style>
