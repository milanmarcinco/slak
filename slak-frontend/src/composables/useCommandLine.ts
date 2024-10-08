import { computed, ref, Ref } from 'vue';
import { UseCommands, useCommands } from './useCommands';

export const useCommandLine = ({
  text,
  onList,
}: {
  text: Ref<string, string>;
  onList: UseCommands['onList'];
}) => {
  const commands = useCommands({
    onList,
  });

  const isCommandMode = computed(() => text.value.startsWith('/'));
  const isValidCommand = computed(() => getIsValidCommand());

  const isLoading = ref(false);
  const isError = ref(false);

  const getIsValidCommand = () => {
    const command = parseCommand(text.value);
    if (!command) return false;

    if (command.name in commands) {
      const { getIsAllowed } = commands[command.name];

      if (getIsAllowed) {
        return getIsAllowed(command.args);
      }

      return true;
    }

    return false;
  };

  const execCommand = async () => {
    const command = parseCommand(text.value);
    if (!command || !isValidCommand.value) return;

    const { handler } = commands[command.name];

    isLoading.value = true;
    isError.value = false;

    try {
      await handler(...command.args);
    } catch {
      isError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isCommandMode,
    isValidCommand,
    execCommand,
    isLoading,
    isError,
  };
};

const parseCommand = (text: string) => {
  const parts = text
    .slice(1)
    .replaceAll(/\s{2,}/g, ' ')
    .split(' ');

  if (parts.length < 1) {
    return null;
  }

  const [name, ...args] = parts;

  return {
    name,
    args,
  };
};
