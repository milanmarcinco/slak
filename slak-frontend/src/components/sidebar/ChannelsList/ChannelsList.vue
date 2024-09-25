<template>
  <div>
    <h2 class="text-subtitle2 q-my-none q-px-sm">{{ title }}</h2>

    <q-list dense padding>
      <ChannelsListItem
        v-for="channel in channels"
        :channel="channel"
        :is-active="channel.id === activeChannelId"
        @select-channel="handleSelectChannel"
        :key="channel.id"
      />
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Channel } from 'components/models';
import { useActiveChannelId } from 'src/composables/useActiveChannelId';
import { useMainStore } from 'src/stores/main';

import ChannelsListItem from './ChannelsListItem.vue';

const { title, channels } = defineProps<{
  title: string;
  channels?: Channel[];
}>();

const router = useRouter();
const mainStore = useMainStore();
const activeChannelId = useActiveChannelId();

const handleSelectChannel = (channelId: Channel['id']) => {
  router.push({ path: channelId.toString() });
  mainStore.setReadChannel(channelId);
};

defineOptions({
  name: 'ChannelsList',
});
</script>
