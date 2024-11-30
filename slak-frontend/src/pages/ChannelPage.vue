<template>
  <q-page class="q-pa-md">
    <Messages
      v-if="activeChannel"
      :channel="activeChannel"
      :key="activeChannel.id"
    />
  </q-page>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import Messages from 'components/messages/Messages.vue';
import { useActiveChannel } from 'composables/useActiveChannel';
import { useChatStore } from 'stores/chat';

const router = useRouter();
const activeChannel = useActiveChannel();
const chatStore = useChatStore();

watch(activeChannel, () => {
  if (!activeChannel) {
    router.push({ name: 'index' });
    return;
  }

  chatStore.clearTypingUser();
});

defineOptions({
  name: 'ChannelPage',
});
</script>
