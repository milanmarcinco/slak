import { defineStore } from 'pinia';

import { LoginData, RegisterData, User, UserStatus } from 'src/contracts';
import { authManager, authService, webPushService } from 'src/services';

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

        webPushService.subscribe();
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
      console.log('🔄 Starting sign out process...');
      
      const chatStore = useChatStore();
      const userStore = useUserStore();

      // Step 1: Unsubscribe from push notifications (non-blocking)
      console.log('📱 Unsubscribing from push notifications in background...');
      webPushService.unsubscribe()
        .then(() => console.log('Push notifications unsubscribed'))
        .catch((err) => console.warn('Failed to unsubscribe from push notifications:', err));

      try {
        // Step 2: Call backend logout API (non-critical)
        console.log('Calling backend logout API...');
        await authService.logout();
        console.log('Backend logout successful');
      } catch (err) {
        console.warn('Failed to call backend logout API:', err);
        // Continue anyway - we can still clear local state
      }

      // Step 3: Clear local storage and state (critical - always execute)
      console.log('Clearing local authentication state...');
      authManager.removeToken();
      
      this.initialized = false;
      this.user = null;
      
      console.log('Clearing chat and user stores...');
      chatStore.nuke();
      userStore.nuke();
      
      console.log('Sign out completed successfully!');
    },
  },
});
