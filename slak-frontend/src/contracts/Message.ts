export type RawMessage = string;

export interface SerializedMessage {
  id: number;
  userId: number;
  channelId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message extends SerializedMessage {
  preview?: boolean;
}
