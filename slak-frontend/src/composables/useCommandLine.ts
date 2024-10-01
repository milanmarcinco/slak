import { computed, ref, Ref } from 'vue';
import { useCommands } from './useCommands';

export const useCommandLine = (text: Ref<string, string>) => {
  const commands = useCommands();

  const isCommandMode = computed(() => text.value.startsWith('/'));
  const isValidCommand = computed(() => getIsValidCommand());

  const isLoading = ref(false);
  const isError = ref(false);

  const getIsValidCommand = () => {
    const command = parseCommand(text.value);
    if (!command) return false;

    if (command.name in commands) {
      const { validateArgs } = commands[command.name];

      if (validateArgs) {
        return validateArgs(command.args);
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
