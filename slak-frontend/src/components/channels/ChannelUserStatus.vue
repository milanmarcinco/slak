<template>
  <div
    class="channel-user-status"
    :class="{
      'channel-user-status--online': status === UserStatus.Online,
      'channel-user-status--offline': status === UserStatus.Offline,
      'channel-user-status--do-not-disturb': status === UserStatus.DoNotDisturb,
    }"
  ></div>
</template>

<script setup lang="ts">
import { UserStatus } from '../models';

const { status } = defineProps<{
  status: UserStatus;
}>();

defineOptions({
  name: 'ChannelUserStatus',
});
</script>

<style scoped lang="scss">
.channel-user-status {
  $size: 10px;

  width: $size;
  height: $size;

  border-radius: 50%;

  &--online {
    background-color: $green-6;
  }

  &--offline {
    background-color: $grey-6;
  }

  &--do-not-disturb {
    background-color: $orange-6;
  }
}
</style>
