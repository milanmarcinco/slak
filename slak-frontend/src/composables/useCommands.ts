import { useRouter } from 'vue-router';

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
      },
      validateArgs: ([channelName, visibility]) => {
        const isChannelNameValid = !!channelName;

        const isVisibilityValid = (() => {
          switch (visibility) {
            case 'public':
            case 'private':
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
