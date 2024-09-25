interface Command<Args extends string[] = string[]> {
  handler: (...args: Args) => void;
  validateArgs?: (args: Partial<Args>) => boolean;
}

export const useCommands = () => {
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
      },
    },
    cancel: {
      handler: async () => {
        console.log('cancel');
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
