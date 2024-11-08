import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Message from "App/Models/Message";

export default class MessagesController {
  private readonly pageSize = 20;

  async loadMessages({ request }: HttpContextContract) {
    const channelId = request.param("channelId");
    const oldestMessageId = request.input("cursor");

    const cursorMessage = oldestMessageId
      ? await Message.find(oldestMessageId)
      : null;

    const messages = await Message.query()
      .where("channel_id", channelId)
      .withScopes((scopes) => scopes.beforeMessage(cursorMessage))
      .orderBy("created_at", "desc")
      .orderBy("id", "desc")
      .limit(this.pageSize);

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
