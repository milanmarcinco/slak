<template>
  <q-item clickable v-ripple @click="$emit('selectChannel', channel.id)">
    <q-item-section>{{ channel.title }}</q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { Channel } from 'components/models';

const { channel } = defineProps<{
  channel: Channel;
}>();

defineEmits<{
  selectChannel: [id: Channel['id']];
}>();

defineOptions({
  name: 'ChannelsListItem',
});
</script>
