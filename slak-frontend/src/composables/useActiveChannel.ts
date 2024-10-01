import { computed } from 'vue';
import { useActiveChannelId } from './useActiveChannelId';
import { useMainStore } from 'src/stores/main';

export const useActiveChannel = () => {
  const mainStore = useMainStore();
  const activeChannelId = useActiveChannelId();

  const activeChannel = computed(() =>
    mainStore.channels?.find((channel) => channel.id === activeChannelId.value)
  );

  return activeChannel;
};
