<template>
  <q-page class="q-px-md q-pt-md">
    <Messages
      v-if="activeChannel"
      :channel="activeChannel"
      :key="activeChannel.id"
    />
  </q-page>
</template>

<script setup lang="ts">
import Messages from 'components/messages/Messages.vue';
import { useActiveChannel } from 'src/composables/useActiveChannel';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeChannel = useActiveChannel();

watch(activeChannel, () => {
  if (!activeChannel) {
    router.push({ name: 'index' });
  }
});

defineOptions({
  name: 'ChannelPage',
});
</script>
