<template>
  <q-page class="q-px-md q-py-md">
    <Messages />
  </q-page>
</template>

<script setup lang="ts">
import Messages from 'components/messages/Messages.vue';

defineOptions({
  name: 'ChannelPage',
});
</script>
