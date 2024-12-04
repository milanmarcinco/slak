import { BootParams, SocketManager } from './SocketManager';

import { SerializedUser, UserStatus } from 'src/contracts';
import { useUserStore } from 'stores/user';

class UserSocketManager extends SocketManager {
  public subscribe({ store }: BootParams): void {
    const userStore = useUserStore(store);

    this.socket.on('user:online', (user: SerializedUser) => {
      userStore.setOnline(user);
    });

    this.socket.on('user:offline', (user: SerializedUser) => {
      userStore.setOffline(user);
    });

    this.socket.on('user:status', (user: SerializedUser) => {
      userStore.setOnline(user);
    });

    this.socket.on('user:list', (users: SerializedUser[]) => {
      userStore.setUsers(users);
    });
  }

  public changeStatus(newStatus: UserStatus): Promise<SerializedUser> {
    return this.emitAsync('changeStatus', newStatus);
  }

  public setNotifSetting(enabled: boolean): Promise<boolean> {
    return this.emitAsync('setNotifSetting', enabled);
  }
}

class UserService {
  private userManager: UserSocketManager | null = null;

  public init() {
    this.userManager = new UserSocketManager('/');
  }

  public changeStatus(newStatus: UserStatus) {
    return this.userManager!.changeStatus(newStatus);
  }

  public setNotifSetting(enabled: boolean) {
    return this.userManager!.setNotifSetting(enabled);
  }

  public nuke() {
    this.userManager?.destroy();
    this.userManager = null;
  }
}

export default new UserService();
