import { ref } from 'vue';

export const useDebounce = <T, U = unknown>(
  fn: (...args: U[]) => T,
  delay: number
) => {
  const timer = ref<number | null>(null);

  const debouncedFn = (...args: U[]) => {
    if (timer.value) {
      clearTimeout(timer.value);
    }

    timer.value = setTimeout(() => {
      fn(...args);
    }, delay) as unknown as number;
  };

  return debouncedFn;
};
