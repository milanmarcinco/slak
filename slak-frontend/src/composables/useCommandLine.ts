import { computed, Ref } from 'vue';

export const useCommandLine = (text: Ref<string, string>) => {
  const isCommandMode = computed(() => text.value.startsWith('/'));

  const execCommand = async () => {
    // Exec command
  };

  return {
    isCommandMode,
    execCommand,
  };
};
