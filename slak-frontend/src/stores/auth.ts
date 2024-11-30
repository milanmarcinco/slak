import { defineStore } from 'pinia';

import { LoginData, RegisterData, User, UserStatus } from 'src/contracts';
import { authManager, authService } from 'src/services';

import { useChatStore } from './chat';
import { useUserStore } from './user';

interface State {
  user: User | null;
  loading: boolean;
  error: boolean;

  initialized: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: null,
    loading: true,
    error: false,

    initialized: false,
  }),

  actions: {
    async authenticated() {
      if (this.initialized) {
        return !!this.user;
      }

      this.initialized = true;
      await this.initialize();

      return !!this.user;
    },

    async initialize() {
      try {
        this.loading = true;
        this.error = false;

        await this.startUp();
      } catch (err) {
        this.error = true;
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    async startUp() {
      const chatStore = useChatStore();
      const userStore = useUserStore();

      this.user = await authService.me();

      if (this.user) {
        const initSockets = this.user.status !== UserStatus.Offline;

        chatStore.init(initSockets);
        userStore.init(initSockets);
      }
    },

    async signUp(data: RegisterData) {
      const apiToken = await authService.register(data);
      authManager.setToken(apiToken.token);

      await this.startUp();
    },

    async signIn(data: LoginData) {
      const apiToken = await authService.login(data);
      authManager.setToken(apiToken.token);

      await this.startUp();
    },

    async signOut() {
      const chatStore = useChatStore();
      const userStore = useUserStore();

      await authService.logout();
      authManager.removeToken();

      this.initialized = false;
      this.user = null;

      chatStore.nuke();
      userStore.nuke();
    },
  },
});
