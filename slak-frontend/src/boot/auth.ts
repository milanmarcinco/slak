import { boot } from 'quasar/wrappers';
import { authManager } from 'src/services';
import { useAuthStore } from 'src/stores/auth';

export default boot(async ({ router, store }) => {
  const authStore = useAuthStore(store);

  authManager.onLogout(() => {
    router.push({ name: 'sign-in' });
  });

  router.beforeEach(async (to, from) => {
    const isAuthenticated = await authStore.authenticated();

    if (!isAuthenticated && to.meta.private) {
      return {
        name: 'sign-in',
        state: {
          from: from.fullPath,
        },
      };
    }

    if (isAuthenticated && !to.meta.private) {
      return {
        name: 'index',
      };
    }
  });
});
