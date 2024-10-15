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

enum Status {
  Online = 'ONLINE',
  DoNotDisturb = 'DO_NOT_DISTURB',
  Offline = 'OFFLINE',
}

const $q = useQuasar();
const { t } = useI18n();

const statuses = Object.values(Status);
const activeStatusIdx = ref(0);

const status = computed(() => {
  switch (statuses[activeStatusIdx.value]) {
    case Status.Offline:
      return {
        label: t('sidebar.status.offline'),
        color: 'grey-6',
      };

    case Status.DoNotDisturb:
      return {
        label: t('sidebar.status.do_not_disturb'),
        color: 'orange-6',
      };

    default:
    case Status.Online:
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
