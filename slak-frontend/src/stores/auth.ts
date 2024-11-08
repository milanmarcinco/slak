import { defineStore } from 'pinia';

import { LoginData, RegisterData, User } from 'src/contracts';
import { authManager, authService } from 'src/services';
import { useChatStore } from './chat';

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
    async authenticate() {
      const user = await authService.me();
      this.user = user;

      return user;
    },

    async initialize() {
      const chatStore = useChatStore();

      try {
        this.loading = true;
        this.error = false;

        const user = await this.authenticate();

        if (user) {
          chatStore.loadChannels();
        }
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

      this.authenticate();
    },

    async signIn(data: LoginData) {
      const apiToken = await authService.login(data);
      authManager.setToken(apiToken.token);

      this.authenticate();
    },

    async signOut() {
      await authService.logout();
      authManager.removeToken();
      this.user = null;
    },
  },
});
