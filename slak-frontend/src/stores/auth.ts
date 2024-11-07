import { defineStore } from 'pinia';

import { User } from 'src/components/models';
import { LoginData, RegisterData } from 'src/contracts';
import { authManager, authService } from 'src/services';

interface State {
  user: User | null;
  loading: boolean;
  error: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: null,
    loading: true,
    error: false,
  }),

  actions: {
    async check() {
      try {
        this.loading = true;
        this.error = false;

        const user = await authService.me();
        await timeoutPromise(1000);
        this.user = user;
      } catch (err) {
        this.error = true;
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    async signUp(data: RegisterData) {
      const apiToken = await authService.register(data);
      authManager.setToken(apiToken.token);

      const user = await authService.me();
      this.user = user;
    },

    async signIn(data: LoginData) {
      const apiToken = await authService.login(data);
      authManager.setToken(apiToken.token);

      const user = await authService.me();
      this.user = user;
    },

    async signOut() {
      await authService.logout();
      authManager.removeToken();
      this.user = null;
    },
  },
});

const timeoutPromise = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
