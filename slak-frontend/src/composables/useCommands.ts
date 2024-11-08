import { useRouter } from 'vue-router';

import { useAuthStore } from 'stores/auth';
import { useMainStore } from 'stores/main';

import { ChannelType } from 'src/contracts';
import { useActiveChannel } from './useActiveChannel';

interface Command<Args extends string[] = string[]> {
  handler: (...args: Args) => void;
  getIsAllowed?: (args: Partial<Args>) => boolean;
}

export interface UseCommands {
  onList: () => void;
}

export const useCommands = ({ onList }: UseCommands) => {
  const router = useRouter();
  const mainStore = useMainStore();
  const authStore = useAuthStore();
  const activeChannel = useActiveChannel();

  const commands: Record<string, Command> = {
    join: {
      handler: async (channelName: string, visibility?: string) => {
        console.log('join', channelName, visibility);

        const channelType = (() => {
          switch (visibility?.toUpperCase()) {
            case ChannelType.Private:
              return ChannelType.Private;
            case ChannelType.Public:
            default:
              return ChannelType.Public;
          }
        })();

        mainStore.createChannel(channelName, channelType);
      },
      getIsAllowed: ([channelName, visibility]) => {
        const isChannelNameValid = !!channelName;
        const type = visibility?.toUpperCase();

        const isVisibilityValid = (() => {
          switch (type) {
            case ChannelType.Public:
            case ChannelType.Private:
            case undefined:
              return true;
            default:
              return false;
          }
        })();

        return isChannelNameValid && isVisibilityValid;
      },
    },
    invite: {
      handler: async (nickName: string) => {
        console.log('invite', nickName);
      },
      getIsAllowed: ([nickName]) => !!nickName,
    },
    revoke: {
      handler: async (nickName: string) => {
        console.log('revoke', nickName);
      },
      getIsAllowed: ([nickName]) => !!nickName,
    },
    kick: {
      handler: async (nickName: string) => {
        console.log('kick', nickName);
      },
      getIsAllowed: ([nickName]) => !!nickName,
    },
    quit: {
      handler: async () => {
        console.log('quit');

        if (!activeChannel.value) return;

        router.push({ path: '/' });
        mainStore.leaveChannel(activeChannel.value.id);
      },
      getIsAllowed() {
        return !!activeChannel.value;
      },
    },
    cancel: {
      handler: async () => {
        console.log('cancel');

        if (!activeChannel.value) return;

        router.push({ path: '/' });
        mainStore.deleteChannel(activeChannel.value.id);
      },
      getIsAllowed() {
        return activeChannel.value?.adminId === authStore.user!.id;
      },
    },
    list: {
      handler: async () => {
        console.log('list');
        onList();
      },
    },
  };

  return commands;
};
