import { Channel } from 'src/components/models';
import { computed, ComputedRef } from 'vue';
import { useRouter } from 'vue-router';

export const useActiveChannelId = () => {
  const router = useRouter();

  const activeChannelId = computed(() => {
    const { channelId } = router.currentRoute.value.params;
    return typeof channelId === 'string' ? parseInt(channelId) : null;
  });

  if (activeChannelId.value === null) {
    throw new Error('Channel ID is missing!');
  }

  return activeChannelId as ComputedRef<Channel['id']>;
};
