<template>
  <div
    class="sidebar-content fit q-px-sm q-py-md bg-dark rounded-borders column"
  >
    <ChannelsList
      :title="$t('sidebar.public_channels')"
      :channels="mainStore.publicChannels"
    />

    <ChannelsList
      :title="$t('sidebar.private_channels')"
      :channels="mainStore.privateChannels"
    />
  </div>
</template>

<script setup lang="ts">
import ChannelsList from 'components/sidebar/ChannelsList/ChannelsList.vue';
import { useMainStore } from 'src/stores/main';

const mainStore = useMainStore();
</script>

<style scoped lang="scss">
.sidebar-content {
  gap: 8px;
}
</style>
