export interface User {
  id: number;
  nickName: string;
  firstName: string;
  lastName: string;
}

export enum ChannelType {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export interface Channel {
  id: number;
  title: string;
  adminId: User['id'];
  type: ChannelType;
  unread?: boolean;
  invite?: boolean;
}

export interface Message {
  id: number;
  author: User;
  content: string;
  createdAt: string;
  preview?: boolean;
}
