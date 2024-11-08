<template>
  <div ref="scrollContainer" class="full-height q-pa-md overflow-auto">
    <q-infinite-scroll
      @load="handleLoadMessages"
      :scroll-target="scrollContainer"
      :key="activeChannel!.id"
      reverse
    >
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <Message
        v-for="(message, idx) in messages"
        :author="'[placeholder]'"
        :content="message.content"
        :created-at="message.createdAt"
        :sent="message.userId === userId"
        :preview="message.preview"
        :privacy="false"
        :highlight="idx === (messages?.length || 0) - 3"
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
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';

import EmptyMessage from 'components/shared/EmptyMessage.vue';
import { useActiveChannel } from 'composables/useActiveChannel';

import { useAuthStore } from 'stores/auth';
import { useChatStore } from 'stores/chat';

import Message from './Message.vue';

const authStore = useAuthStore();
const chatStore = useChatStore();

const userId = authStore.user?.id;
const activeChannel = useActiveChannel();

const messages = computed(() =>
  activeChannel.value?.id ? chatStore.messages[activeChannel.value.id] : null
);

const handleLoadMessages: QInfiniteScrollProps['onLoad'] = async (_, done) => {
  if (activeChannel.value!.reachedEnd) {
    return done(true);
  }

  const oldestMessageId = messages.value?.[0]?.id;

  const hasMore = await chatStore.loadMessages(
    activeChannel.value!.id,
    oldestMessageId
  );

  done(!hasMore);
};

onMounted(() => {
  // mainStore.setReadChannel(activeChannelId.value!);
});

const scrollLock = ref(true);
const scrollContainer = ref<HTMLDivElement>();

const handleScroll = () => {
  if (!scrollContainer.value) return;

  const isAtBottom =
    scrollContainer.value.scrollHeight - scrollContainer.value.scrollTop ===
    scrollContainer.value.clientHeight;

  scrollLock.value = isAtBottom;
};

onMounted(() =>
  scrollContainer.value?.addEventListener('scroll', handleScroll)
);

onBeforeUnmount(() =>
  scrollContainer.value?.removeEventListener('scroll', handleScroll)
);

watch(
  () => [messages.value?.length],
  () =>
    nextTick(() => {
      if (!scrollContainer.value) {
        return;
      }

      if (!scrollLock.value) {
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
