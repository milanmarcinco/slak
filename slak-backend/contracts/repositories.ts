declare module "@ioc:Repositories/MessageRepository" {
  export interface SerializedMessage {
    id: number;
    userId: number;
    channelId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface MessageRepositoryContract {
    create(
      channelId: number,
      userId: number,
      content: string
    ): Promise<SerializedMessage>;
  }

  const MessageRepository: MessageRepositoryContract;
  export default MessageRepository;
}

declare module "@ioc:Repositories/ChannelRepository" {
  import { ChannelType } from "App/Enums/ChannelType";
  import User from "App/Models/User";

  export interface SerializedChannel {
    id: number;
    name: string;
    adminId: number;
    type: ChannelType;
    createdAt: string;
    updatedAt: string;
  }

  export interface SerializedChannelWithInvite extends SerializedChannel {
    invite: boolean;
  }

  export interface ChannelRepositoryContract {
    getUserRoom(user: User): string;
  }

  const ChannelsRepository: ChannelRepositoryContract;
  export default ChannelsRepository;
}
