import { useRouter } from 'vue-router';

import { ChannelType } from 'components/models';
import { useMainStore } from 'stores/main';

import { useActiveChannel } from './useActiveChannel';

interface Command<Args extends string[] = string[]> {
  handler: (...args: Args) => void;
  validateArgs?: (args: Partial<Args>) => boolean;
}

export const useCommands = () => {
  const router = useRouter();
  const mainStore = useMainStore();
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
      validateArgs: ([channelName, visibility]) => {
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
      validateArgs: ([nickName]) => !!nickName,
    },
    revoke: {
      handler: async (nickName: string) => {
        console.log('revoke', nickName);
      },
      validateArgs: ([nickName]) => !!nickName,
    },
    kick: {
      handler: async (nickName: string) => {
        console.log('kick', nickName);
      },
      validateArgs: ([nickName]) => !!nickName,
    },
    quit: {
      handler: async () => {
        console.log('quit');

        if (!activeChannel.value) return;

        router.push({ path: '/' });
        mainStore.leaveChannel(activeChannel.value.id);
      },
      validateArgs() {
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
      validateArgs() {
        return activeChannel.value?.adminId === mainStore.user!.id;
      },
    },
    list: {
      handler: async () => {
        console.log('list');
      },
    },
  };

  return commands;
};
