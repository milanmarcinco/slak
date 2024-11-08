import { computed } from 'vue';

import { useActiveChannelId } from './useActiveChannelId';
import { useChatStore } from 'stores/chat';

export const useActiveChannel = () => {
  const chatStore = useChatStore();
  const activeChannelId = useActiveChannelId();

  const activeChannel = computed(() =>
    chatStore.channels?.find((channel) => channel.id === activeChannelId.value)
  );

  return activeChannel;
};
