import { User } from './Auth';

export type RawMessage = string;

export interface SerializedMessage {
  id: number;
  userId: number;
  channelId: number;
  content: string;
  createdAt: string;
  updatedAt: string;

  author: User;
  mentions: User[];
}

export interface Message extends SerializedMessage {
  preview?: boolean;
}
