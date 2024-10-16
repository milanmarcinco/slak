<template>
  <q-chip
    :color="status.color"
    icon="circle"
    class="status-chip"
    @click="handleClick"
    clickable
    outline
  >
    {{ status.label }}
  </q-chip>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { UserStatus } from '../models';

const $q = useQuasar();
const { t } = useI18n();

const statuses = Object.values(UserStatus);
const activeStatusIdx = ref(0);

const status = computed(() => {
  switch (statuses[activeStatusIdx.value]) {
    case UserStatus.Offline:
      return {
        label: t('sidebar.status.offline'),
        color: 'grey-6',
      };

    case UserStatus.DoNotDisturb:
      return {
        label: t('sidebar.status.do_not_disturb'),
        color: 'orange-6',
      };

    default:
    case UserStatus.Online:
      return {
        label: t('sidebar.status.online'),
        color: 'green-6',
      };
  }
});

const handleClick = () => {
  activeStatusIdx.value = (activeStatusIdx.value + 1) % statuses.length;

  $q.notify({
    message: `Status changed to '${status.value.label.toLowerCase()}'`,
  });
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
