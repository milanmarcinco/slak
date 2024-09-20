<template>
  <h2 class="text-subtitle2 q-my-none q-px-sm">{{ title }}</h2>

  <q-list dense padding>
    <ChannelsListItem
      v-for="channel in channels"
      :channel="channel"
      @select-channel="handleSelectChannel"
      :key="channel.id"
    />
  </q-list>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import ChannelsListItem from './ChannelsListItem.vue';
import { Channel } from 'components/models';

const { title, channels } = defineProps<{
  title: string;
  channels: Channel[];
}>();

const router = useRouter();

const handleSelectChannel = (channelId: Channel['id']) => {
  router.push({ path: `${channelId}` });
};

defineOptions({
  name: 'ChannelsList',
});
</script>
