<template>
  <q-chip
    :color="activeStatus.color"
    icon="circle"
    class="status-chip"
    @click="handleClick"
    clickable
    outline
  >
    {{ activeStatus.label }}
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserStore } from 'src/stores/user';
import { UserStatus } from '../models';

const { t } = useI18n();
const userStore = useUserStore();

const statuses = Object.values(UserStatus);

const activeStatus = computed(() => {
  switch (userStore.me?.status) {
    case UserStatus.Offline:
      return {
        label: t('sidebar.status.offline'),
        color: 'grey-6',
        idx: statuses.indexOf(UserStatus.Offline),
      };

    case UserStatus.DoNotDisturb:
      return {
        label: t('sidebar.status.do_not_disturb'),
        color: 'orange-6',
        idx: statuses.indexOf(UserStatus.DoNotDisturb),
      };

    default:
    case UserStatus.Online:
      return {
        label: t('sidebar.status.online'),
        color: 'green-6',
        idx: statuses.indexOf(UserStatus.Online),
      };
  }
});

const getNextStatus = () => {
  const newStatusIdx = (activeStatus.value.idx + 1) % statuses.length;
  return statuses[newStatusIdx];
};

const handleClick = () => {
  const newStatus = getNextStatus();
  userStore.changeStatus(newStatus);
};
</script>

<style scoped lang="scss">
.status-chip {
  height: auto;
  padding: 2px 8px;

  :deep(.q-icon) {
    font-size: 16px;
  }
}
</style>
