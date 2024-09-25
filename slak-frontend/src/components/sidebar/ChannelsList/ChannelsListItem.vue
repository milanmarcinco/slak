<template>
  <q-item
    clickable
    v-ripple
    @click="$emit('selectChannel', channel.id)"
    class="channels-list-item rounded-borders"
    :class="{
      'channels-list-item--active': isActive,
      'channels-list-item--unread': channel.unread,
    }"
  >
    <q-item-section>{{ channel.title }}</q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { Channel } from 'components/models';

const { channel, isActive } = defineProps<{
  channel: Channel;
  isActive?: boolean;
}>();

defineEmits<{
  selectChannel: [id: Channel['id']];
}>();

defineOptions({
  name: 'ChannelsListItem',
});
</script>

<style scoped lang="scss">
.channels-list-item {
  position: relative;
  padding-left: 20px;

  $unit: 12px;
  $unit_medium: 16px;
  $unit_large: 20px;

  &:before {
    content: '';

    position: absolute;
    top: 50%;
    left: 6px;

    width: 4px;
    height: $unit;

    transform: translateY(-50%);

    transition-property: height background-color;
    transition-duration: 100ms;
    transition-timing-function: ease-in-out;

    background-color: transparent;
    border-radius: $border-radius;
  }

  &:hover:before {
    height: $unit_large;
  }

  &--unread {
    &:before {
      background-color: $warning;
    }
  }

  &--active {
    font-weight: bold;

    &:before {
      height: $unit_medium;
      background-color: $primary;
    }
  }
}
</style>
