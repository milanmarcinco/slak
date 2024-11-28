<template>
  <q-dialog
    :model-value="isOpen"
    @update:model-value="$emit('close')"
    @hide="$emit('afterClose')"
  >
    <q-card class="channel-users-list" flat bordered>
      <q-card-section>
        <div class="channel-users-list__header q-mb-md">
          <h2 class="text-h5 q-ma-none">
            {{ $t('channel.members', { channelName: activeChannel?.name }) }}
          </h2>

          <q-btn icon="close" size="sm" flat dense @click="$emit('close')" />
        </div>

        <q-spinner
          v-if="loading"
          color="primary"
          size="md"
          class="block q-mx-auto"
        />

        <q-list v-if="!loading" dense>
          <q-item
            v-for="user in users"
            class="channel-users-list__item rounded-borders"
            :key="user.id"
          >
            <q-item-section>
              <span class="channel-users-list__label">
                <span class="text-weight-bold">
                  {{ `${user.firstName} ${user.lastName}` }}
                </span>

                <span>•</span>

                <span class="channel-users-list__label--caption">
                  {{ user.nickName }}
                </span>
              </span>
            </q-item-section>

            <q-item-section side>
              <ChannelUserStatus :status="getDisplayStatus(user)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import ChannelUserStatus from './ChannelUserStatus.vue';

import { useActiveChannel } from 'composables/useActiveChannel';
import { api } from 'lib/axios';
import { SerializedUser, User, UserStatus } from 'src/contracts';
import { useUserStore } from 'stores/user';

const LIMIT = 1000;

const { isOpen } = defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  close: [];
  afterClose: [];
}>();

const users = ref<SerializedUser[]>([]);
const loading = ref(false);

const activeChannel = useActiveChannel();
const userStore = useUserStore();

const getDisplayStatus = (user: User): UserStatus => {
  return userStore.users[user.id]?.status || UserStatus.Offline;
};

watch(
  () => isOpen,
  async () => {
    if (!isOpen) return;

    try {
      users.value = [];
      loading.value = true;

      const response = await api.get<SerializedUser[]>(
        `/channels/${activeChannel.value?.id}/users`,
        { params: { limit: LIMIT } }
      );

      users.value = response.data;
    } catch (err) {
      // Do nothing
    } finally {
      loading.value = false;
    }
  }
);

defineOptions({
  name: 'ChannelUsersList',
});
</script>

<style scoped lang="scss">
.channel-users-list {
  width: 100%;
  max-width: 20rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__item {
    padding: 0;

    & + & {
      margin-top: 2px;
    }
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 6px;

    &--caption {
      font-size: $font-xs;
      color: $light;
    }
  }
}
</style>
