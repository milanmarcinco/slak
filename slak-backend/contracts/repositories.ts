// here we are declaring our MessageRepository types for Repositories/MessageRepository
// container binding. See providers/AppProvider.ts for how we are binding the implementation
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
