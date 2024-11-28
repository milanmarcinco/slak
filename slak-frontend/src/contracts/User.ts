export enum UserStatus {
  Online = 'ONLINE',
  Offline = 'OFFLINE',
  DoNotDisturb = 'DO_NOT_DISTURB',
}

export interface SerializedUser {
  id: number;
  email: string;
  nickName: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User extends SerializedUser {}
