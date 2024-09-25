<template>
  <q-infinite-scroll
    @load="undefined"
    reverse
    class="messages full-height q-px-md q-pb-md"
  >
    <!-- <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template> -->

    <Message
      v-for="message in messages"
      :author="message.author.username"
      :content="message.content"
      :created-at="message.createdAt"
      :sent="userId === message.author.id"
      :key="message.id"
    />
  </q-infinite-scroll>
</template>

<script setup lang="ts">
import { useActiveChannelId } from 'src/composables/useActiveChannelId';
import { useMainStore } from 'src/stores/main';

import Message from './Message.vue';

const mainStore = useMainStore();
const activeChannelId = useActiveChannelId();

const userId = mainStore.user?.id;

const messages = activeChannelId.value
  ? mainStore.messages[activeChannelId.value]
  : null;

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Messages',
});
</script>
