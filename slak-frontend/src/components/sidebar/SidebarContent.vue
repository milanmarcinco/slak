<template>
  <div
    class="sidebar-content fit q-px-sm q-py-md bg-dark rounded-borders column"
  >
    <ChannelsList
      :title="$t('sidebar.public_channels')"
      :channels="publicChannels"
    />

    <ChannelsList
      :title="$t('sidebar.private_channels')"
      :channels="privateChannels"
    />
  </div>
</template>

<script setup lang="ts">
import { ChannelType } from 'components/models';
import ChannelsList from 'components/sidebar/ChannelsList/ChannelsList.vue';
import { useMainStore } from 'stores/main';
import { computed } from 'vue';

const mainStore = useMainStore();

const publicChannels = computed(() =>
  mainStore.channels?.filter((channel) => channel.type === ChannelType.Public)
);

const privateChannels = computed(() =>
  mainStore.channels?.filter((channel) => channel.type === ChannelType.Private)
);
</script>

<style scoped lang="scss">
.sidebar-content {
  gap: 8px;
}
</style>
