import type {
  MessageRepositoryContract,
  SerializedMessage,
} from "@ioc:Repositories/MessageRepository";

import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class MessageRepository implements MessageRepositoryContract {
  public async create(
    channelId: Channel["id"],
    userId: User["id"],
    content: string
  ): Promise<SerializedMessage> {
    const channel = await Channel.findOrFail(channelId);

    const message = await channel
      .related("messages")
      .create({ userId, content });

    return message.serialize() as SerializedMessage;
  }
}
