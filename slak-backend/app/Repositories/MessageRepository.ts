import type {
  MessageRepositoryContract,
  SerializedMessage,
} from "@ioc:Repositories/MessageRepository";

import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class MessageRepository implements MessageRepositoryContract {
  public async create(
    userId: User["id"],
    channelId: Channel["id"],
    content: string,
    mentions: User["id"][]
  ): Promise<SerializedMessage> {
    const channel = await Channel.findOrFail(channelId);

    const message = await channel
      .related("messages")
      .create({ userId, content });

    await message.related("mentions").attach(mentions);

    await message.load("mentions");
    await message.load("author");

    return message.serialize() as SerializedMessage;
  }
}
