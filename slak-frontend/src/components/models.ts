export enum UserStatus {
  Online = 'ONLINE',
  DoNotDisturb = 'DO_NOT_DISTURB',
  Offline = 'OFFLINE',
}

export interface User {
  id: number;
  email: string;
  nickName: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
}
