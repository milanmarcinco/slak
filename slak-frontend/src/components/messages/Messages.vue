<template>
  <div ref="scrollContainer" class="full-height q-pa-md overflow-auto">
    <q-infinite-scroll
      @load="handleLoadMore"
      :scroll-target="scrollContainer"
      :key="activeChannelId!"
      reverse
    >
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <Message
        v-for="message in messages"
        :author="message.author.nickName"
        :content="message.content"
        :created-at="message.createdAt"
        :sent="message.author.id === userId"
        :preview="message.preview"
        :privacy="mainStore.privacyMode"
        :key="message.id"
      />

      <EmptyMessage
        :text="$t('messages.no_messages')"
        :show="!messages || !messages.length"
        larger
      />
    </q-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { QInfiniteScrollProps } from 'quasar';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import EmptyMessage from 'components/shared/EmptyMessage.vue';
import { useActiveChannelId } from 'composables/useActiveChannelId';
import { useMainStore } from 'stores/main';

import Message from './Message.vue';

const mainStore = useMainStore();
const activeChannelId = useActiveChannelId();

const scrollContainer = ref<HTMLDivElement>();

const userId = mainStore.user?.id;

const messages = computed(() =>
  activeChannelId.value ? mainStore.messages[activeChannelId.value] : null
);

const handleLoadMore: QInfiniteScrollProps['onLoad'] = (_, done) => {
  setTimeout(() => done(true), 1000);
};

onMounted(() => {
  mainStore.setReadChannel(activeChannelId.value!);
});

watch(
  () => [messages.value],
  () =>
    nextTick(() => {
      if (!scrollContainer.value) {
        return;
      }

      scrollContainer.value.scrollTo({
        top: scrollContainer.value.scrollHeight,
      });
    })
);

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Messages',
});
</script>
