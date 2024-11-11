import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { SerializedMessage } from "@ioc:Repositories/MessageRepository";

import Channel from "App/Models/Channel";
import Message from "App/Models/Message";

export default class MessagesController {
  private readonly pageSize = 20;

  async loadMessages({ auth, request }: HttpContextContract): Promise<{
    messages: SerializedMessage[];
    hasMore: boolean;
  }> {
    const userId = auth.user!.id;
    const channelId = request.param("channelId");
    const oldestMessageId = request.input("cursor");

    // Remove channel invite on channel/messages load
    const channel = await Channel.findOrFail(channelId);
    await channel.related("invites").detach([userId]);

    // Obtain the oldest message to use as a cursor
    const cursorMessage = oldestMessageId
      ? await Message.find(oldestMessageId)
      : null;

    const messages = (
      await Message.query()
        .where("channel_id", channelId)
        .withScopes((scopes) => scopes.beforeMessage(cursorMessage))
        .orderBy("created_at", "desc")
        .orderBy("id", "desc")
        .preload("mentions")
        .preload("author")
        .limit(this.pageSize)
    ).map((m) => m.serialize() as SerializedMessage);

    // Check if there are more messages left
    const countRows = await Message.query()
      .where("channel_id", channelId)
      .withScopes((scopes) => scopes.beforeMessage(cursorMessage))
      .count("id", "total");

    const hasMore = countRows[0]["$extras"]["total"] > this.pageSize;

    return {
      messages,
      hasMore,
    };
  }
}
