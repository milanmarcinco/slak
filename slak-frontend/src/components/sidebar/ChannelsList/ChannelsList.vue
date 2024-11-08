<template>
  <div class="channels-list">
    <h2
      class="channels-list__title text-subtitle2 q-ma-none q-px-sm q-py-xs rounded-borders"
    >
      <div class="channels-list__title-content">
        <slot name="icon"></slot>
        {{ title }}
      </div>

      <q-btn
        icon="add"
        size="10px"
        flat
        dense
        @click="$emit('createChannel')"
      />
    </h2>

    <q-list dense padding>
      <ChannelsListItem
        v-for="channel in channels"
        :channel="channel"
        :is-active="channel.id === activeChannelId"
        :show-delete="channel.adminId === authStore.user?.id"
        @select-channel="handleSelectChannel"
        @leave-channel="handleLeaveChannel"
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

import { useActiveChannelId } from 'composables/useActiveChannelId';

import { useAuthStore } from 'stores/auth';
import { useChatStore } from 'stores/chat';

import { Channel } from 'src/contracts';
import EmptyMessage from 'components/shared/EmptyMessage.vue';

import ChannelsListItem from './ChannelsListItem.vue';

const { title, channels } = defineProps<{
  title: string;
  channels?: Channel[];
}>();

const router = useRouter();
const authStore = useAuthStore();
const chatStore = useChatStore();
const activeChannelId = useActiveChannelId();

const handleSelectChannel = (channelId: Channel['id']) => {
  router.push({ path: channelId.toString() });
  // mainStore.setReadChannel(channelId);
};

const handleLeaveChannel = (channelId: Channel['id']) => {
  if (channelId === activeChannelId.value) {
    router.push({ path: '/' });
  }

  chatStore.leaveChannel(channelId);
};

defineEmits<{
  createChannel: [];
}>();

defineOptions({
  name: 'ChannelsList',
});
</script>

<style scoped lang="scss">
.channels-list {
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: $darker;
  }

  &__title-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
