<template>
  <div
    class="message"
    :class="{
      'message--sent': sent,
      'message--preview': preview,
      'message--privacy': privacy,
      'message--highlight': highlight,
    }"
  >
    <div class="message__caption">{{ caption }}</div>

    <div class="message__content-container">
      <span class="message__content">{{ content }}</span>
    </div>

    
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { author, content, createdAt, preview, sent, privacy, highlight } =
  defineProps<{
    author: string;
    content: string;
    createdAt: string;
    preview?: boolean;
    sent?: boolean;
    privacy?: boolean;
    highlight?: boolean;
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
  max-width: 80%;

  cursor: default;

  & + & {
    margin-top: 12px;
  }

  &__caption {
    font-size: $font-xs;
  }

  &__content-container {
    width: 100%;
    max-width: max-content;

    padding: 6px 8px;
    margin-top: 2px;

    background-color: $dark;
    border-radius: 6px;
  }

  &__content {
    transition: 150ms opacity ease-in-out;
  }

  &--sent {
    margin-left: auto;

    .message {
      &__content-container {
        margin-left: auto;
        background-color: $primary;
      }
    }
  }

  &--preview {
    .message {
      &__caption,
      &__content-container {
        color: $light;
      }
    }
  }

  &--privacy {
    .message {
      &__content {
        opacity: 0;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  &--highlight {
    padding: 6px 6px 6px 8px;

    border-left: 4px solid $warning;
    border-radius: $border-radius;
    background-color: #37311e;
  }
}
</style>
