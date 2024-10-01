<template>
  <q-infinite-scroll
    @load="undefined"
    class="full-height q-px-md overflow-auto"
    :key="activeChannelId!"
    reverse
  >
    <!-- <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template> -->

    <Message
      v-for="message in messages"
      :author="message.author.nickName"
      :content="message.content"
      :created-at="message.createdAt"
      :sent="userId === message.author.id"
      :key="message.id"
    />

    <EmptyMessage
      :text="$t('messages.no_messages')"
      :show="!messages || !messages.length"
      larger
    />
  </q-infinite-scroll>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { useActiveChannelId } from 'src/composables/useActiveChannelId';
import { useMainStore } from 'src/stores/main';

import Message from './Message.vue';
import EmptyMessage from '../shared/EmptyMessage.vue';

const mainStore = useMainStore();
const activeChannelId = useActiveChannelId();

const userId = mainStore.user?.id;

const messages = computed(() =>
  activeChannelId.value ? mainStore.messages[activeChannelId.value] : null
);

onMounted(() => {
  mainStore.setReadChannel(activeChannelId.value!);
});

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Messages',
});
</script>
