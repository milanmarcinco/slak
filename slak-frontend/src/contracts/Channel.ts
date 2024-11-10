import { User } from './Auth';

export enum ChannelType {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export interface SerializedChannel {
  id: number;
  name: string;
  adminId: User['id'];
  type: ChannelType;
  createdAt: string;
  updatedAt: string;
  invite?: boolean;
}

export interface Channel extends SerializedChannel {
  unread?: boolean;
  reachedEnd?: boolean;
}
