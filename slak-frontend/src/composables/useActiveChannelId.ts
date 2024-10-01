import { computed } from 'vue';
import { useRouter } from 'vue-router';

export const useActiveChannelId = () => {
  const router = useRouter();

  const activeChannelId = computed(() => {
    const { channelId } = router.currentRoute.value.params;
    return typeof channelId === 'string' ? parseInt(channelId) : null;
  });

  return activeChannelId;
};
