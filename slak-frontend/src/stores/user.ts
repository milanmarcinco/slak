import { defineStore } from 'pinia';

import { User, UserStatus } from 'src/contracts';
import { userService } from 'src/services';

import { useAuthStore } from './auth';
import { useChatStore } from './chat';

interface State {
  users: Record<User['id'], User>;
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    users: {},
  }),

  getters: {
    me() {
      const authStore = useAuthStore();
      return authStore.user!;
    },
  },

  actions: {
    init(initSockets?: boolean) {
      if (initSockets) {
        userService.init();
      }
    },

    setOnline(user: User) {
      this.users[user.id] = user;
    },

    setOffline(user: User) {
      delete this.users[user.id];
    },

    setUsers(users: User[]) {
      users.forEach((user) => (this.users[user.id] = user));
    },

    async changeStatus(newStatus: UserStatus) {
      const authStore = useAuthStore();
      const chatStore = useChatStore();

      const oldStatus = this.me.status;

      if (oldStatus === UserStatus.Offline) {
        this.init(true);
        chatStore.init(true);
      }

      const me = await userService.changeStatus(newStatus);
      authStore.user = me;

      if (newStatus === UserStatus.Offline) {
        this.disconnect();
        chatStore.disconnect();
      }
    },

    async setNotifSetting(enabled: boolean) {
      this.me.notifsEnabled = await userService.setNotifSetting(enabled);
    },

    disconnect() {
      userService.nuke();
    },

    nuke() {
      this.disconnect();
      this.users = {};
    },
  },
});
