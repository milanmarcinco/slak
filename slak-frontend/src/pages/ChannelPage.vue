<template>
  <q-page class="container">
    <div class="messages">
      <Messages />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Messages from 'components/messages/Messages.vue';

defineOptions({
  name: 'ChannelPage',
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}

.messages {
  flex-grow: 1;
}
</style>
