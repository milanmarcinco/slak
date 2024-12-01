import { useQuasar } from 'quasar';
import { watch } from 'vue';

export interface Message {
  type: 'page-visibility';
  value: boolean;
}

export const useWorkerPageVisibility = () => {
  const $q = useQuasar();

  const postMessage = async (visible: boolean) => {
    console.log('[visibility]:', visible);

    const registration = await navigator.serviceWorker.ready;

    registration.active?.postMessage({
      type: 'page-visibility',
      value: visible,
    } as Message);
  };

  watch(() => $q.appVisible, postMessage);
  postMessage($q.appVisible);
};
