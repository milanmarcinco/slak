<template>
  <div class="sidebar-content fit q-px-sm q-py-md bg-dark">
    <div class="sidebar-content__main">
      <ChannelsList
        :title="$t('sidebar.public_channels')"
        :channels="publicChannels"
        @create-channel="handleCreateChannel(ChannelType.Public)"
      >
        <template #icon>
          <q-icon name="public" size="xs" color="grey-6" />
        </template>
      </ChannelsList>

      <ChannelsList
        :title="$t('sidebar.private_channels')"
        :channels="privateChannels"
        @create-channel="handleCreateChannel(ChannelType.Private)"
      >
        <template #icon>
          <q-icon name="lock_outline" size="xs" color="grey-6" />
        </template>
      </ChannelsList>

      <CreateChannelModal
        v-if="createChannelType"
        :type="createChannelType"
        :is-open="createChannelIsOpen"
        @close="createChannelIsOpen = false"
        @after-close="createChannelType = undefined"
      />
    </div>

    <q-list dense class="sidebar-content__footer">
      <StatusChip />

      <q-item
        clickable
        v-ripple
        class="rounded-borders q-mt-xs"
        @click="handleSetNotifSetting"
      >
        <q-item-section>
          {{
            userStore.me.notifsEnabled
              ? $t('sidebar.all_notifications')
              : $t('sidebar.mention_notifications')
          }}
        </q-item-section>

        <q-item-section avatar>
          <q-toggle
            :model-value="userStore.me.notifsEnabled"
            v-on:update:model-value="handleSetNotifSetting"
          />
        </q-item-section>
      </q-item>

      <q-separator class="q-my-sm" />

      <q-item clickable v-ripple class="rounded-borders" @click="handleSignOut">
        <q-item-section>
          {{ $t('sidebar.sign_out') }}
        </q-item-section>

        <q-item-section avatar>
          <q-icon name="logout" size="xs" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import ChannelsList from 'components/sidebar/ChannelsList/ChannelsList.vue';

import CreateChannelModal from './CreateChannelModal.vue';
import StatusChip from './StatusChip.vue';

import { Channel, ChannelType } from 'src/contracts';

import { useAuthStore } from 'stores/auth';
import { useChatStore } from 'stores/chat';
import { useUserStore } from 'stores/user';

const router = useRouter();

const authStore = useAuthStore();
const chatStore = useChatStore();
const userStore = useUserStore();

const createChannelIsOpen = ref(false);
const createChannelType = ref<Channel['type']>();

const handleCreateChannel = (type: Channel['type']) => {
  createChannelType.value = type;
  createChannelIsOpen.value = true;
};

const publicChannels = computed(() =>
  chatStore.channels?.filter((channel) => channel.type === ChannelType.Public)
);

const privateChannels = computed(() =>
  chatStore.channels?.filter((channel) => channel.type === ChannelType.Private)
);

const handleSetNotifSetting = () => {
  userStore.setNotifSetting(!userStore.me.notifsEnabled);
};

const handleSignOut = async () => {
  await authStore.signOut();
  router.push({ name: 'sign-in' });
};
</script>

<style scoped lang="scss">
.sidebar-content {
  gap: 8px;

  display: flex;
  flex-direction: column;

  padding-bottom: max(env(safe-area-inset-bottom), 16px);

  &__main {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    gap: 8px;

    overflow: auto;
  }

  @media (min-width: $breakpoint-md-min) {
    & {
      border-radius: $border-radius;
    }
  }
}
</style>
