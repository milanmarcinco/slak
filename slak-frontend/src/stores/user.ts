import { defineStore } from 'pinia';

import { User, UserStatus } from 'src/contracts';
import { userService } from 'src/services';
import { useAuthStore } from './auth';

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

      const me = await userService.changeStatus(newStatus);
      authStore.user = me;
    },

    nuke() {
      userService.nuke();
      this.users = {};
    },
  },
});
