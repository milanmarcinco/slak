<template>
  <div>
    <h2 class="text-subtitle2 q-my-none q-px-sm">{{ title }}</h2>

    <q-list dense padding>
      <ChannelsListItem
        v-for="channel in channels"
        :channel="channel"
        :is-active="channel.id === activeChannelId"
        @select-channel="handleSelectChannel"
        @leave-channel="handleLeaveChannel"
        @delete-channel="handleDeleteChannel"
        :key="channel.id"
      />

      <EmptyMessage
        :text="$t('sidebar.no_channels')"
        :show="!channels || !channels.length"
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
import EmptyMessage from 'src/components/shared/EmptyMessage.vue';

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

const handleLeaveChannel = (channelId: Channel['id']) => {
  if (channelId === activeChannelId.value) {
    router.push({ path: '/' });
  }

  mainStore.leaveChannel(channelId);
};

const handleDeleteChannel = (channelId: Channel['id']) => {
  if (channelId === activeChannelId.value) {
    router.push({ path: '/' });
  }

  mainStore.deleteChannel(channelId);
};

defineOptions({
  name: 'ChannelsList',
});
</script>
