<template>
  <ChannelsList
    :title="t('sidebar.public_channels')"
    :channels="publicChannels"
  />

  <ChannelsList
    :title="t('sidebar.private_channels')"
    :channels="privateChannels"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Channel } from 'components/models';
import ChannelsList from 'components/sidebar/ChannelsList/ChannelsList.vue';

const { t } = useI18n();

const publicChannels: Channel[] = [
  { id: 1, title: 'General' },
  { id: 2, title: 'Random' },
];

const privateChannels: Channel[] = [
  { id: 3, title: 'Secret' },
  { id: 4, title: 'Hidden' },
];
</script>
