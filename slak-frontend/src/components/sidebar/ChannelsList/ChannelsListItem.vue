<template>
  <q-item
    clickable
    v-ripple
    @click="$emit('selectChannel', channel.id)"
    class="channels-list-item rounded-borders"
    :class="{
      'channels-list-item--active': isActive,
      'channels-list-item--unread': channel.unread,
      'channels-list-item--invite': channel.invite,
    }"
  >
    <q-item-section>{{ channel.title }}</q-item-section>

    <q-item-section class="channels-list-item__actions" avatar side>
      <q-btn size="10px" flat dense icon="more_horiz" @click.stop>
        <q-menu anchor="bottom right" self="top right">
          <q-list>
            <q-item
              @click="$emit('leaveChannel', channel.id)"
              clickable
              v-close-popup
              dense
            >
              <q-item-section>
                {{ $t('sidebar.channel_actions.leave_channel') }}
              </q-item-section>
            </q-item>

            <q-item
              v-if="showDelete"
              @click="$emit('deleteChannel', channel.id)"
              clickable
              v-close-popup
              dense
            >
              <q-item-section>
                {{ $t('sidebar.channel_actions.delete_channel') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { Channel } from 'components/models';

const { channel, isActive } = defineProps<{
  channel: Channel;
  showDelete?: boolean;
  isActive?: boolean;
}>();

defineEmits<{
  selectChannel: [id: Channel['id']];
  leaveChannel: [id: Channel['id']];
  deleteChannel: [id: Channel['id']];
}>();

defineOptions({
  name: 'ChannelsListItem',
});
</script>

<style scoped lang="scss">
.channels-list-item {
  position: relative;
  padding-left: 20px;
  padding-right: 8px;

  & + & {
    margin-top: 2px;
  }

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

  &--invite {
    background-color: rgba($warning, 0.1);

    &:before {
      background-color: $warning;
    }
  }
}
</style>
