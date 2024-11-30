<template>
  <div ref="scrollContainer" class="full-height q-pa-md overflow-auto">
    <q-infinite-scroll
      @load="handleLoadMessages"
      :scroll-target="scrollContainer"
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
        :sent="message.userId === userId"
        :preview="message.preview"
        :privacy="chatStore.privacyMode"
        :highlight="includes(message.mentions, (u) => u.id === userId)"
        :key="message.id"
      />

      <Message
        v-if="typingMessage"
        :author="typingMessage.user.nickName"
        :content="typingMessage.message"
        :privacy="chatStore.privacyMode"
        preview
      />

      <EmptyMessage :text="$t('messages.no_messages')" :show="empty" larger />
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

import { useAuthStore } from 'stores/auth';
import { useChatStore } from 'stores/chat';
import { useUserStore } from 'stores/user';

import { Channel, UserStatus } from 'src/contracts';
import Message from './Message.vue';

import { includes } from 'src/lib/helpers';

const { channel } = defineProps<{
  channel: Channel;
}>();

const authStore = useAuthStore();
const chatStore = useChatStore();
const userStore = useUserStore();

const userId = authStore.user?.id;
const messages = computed(() => chatStore.messages[channel.id]);
const empty = computed(() => messages.value && messages.value.length === 0);

const handleLoadMessages: QInfiniteScrollProps['onLoad'] = async (_, done) => {
  if (channel.reachedEnd) return done(true);

  const oldestMessageId = messages.value?.[0]?.id;
  const hasMore = await chatStore.loadMessages(channel.id, oldestMessageId);
  done(!hasMore);
};

const typingMessage = computed(() => {
  const user = chatStore.selectedTypingUser;
  if (!user) return;

  const message = chatStore.typing[channel.id]?.[user.id];
  if (!message) return;

  return { user, message };
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
  () => [messages.value, messages.value?.length],
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

      chatStore.setReadChannel(channel.id);
    })
);

watch(
  () => userStore.me.status,
  (_, oldStatus) => {
    if (oldStatus === UserStatus.Offline) {
      chatStore.loadMessages(channel.id);
    }
  }
);

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Messages',
});
</script>
