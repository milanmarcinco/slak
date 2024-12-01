import webPush from "web-push";

import Database from "@ioc:Adonis/Lucid/Database";
import type {
  MessageRepositoryContract,
  SerializedMessage,
} from "@ioc:Repositories/MessageRepository";

import Channel from "App/Models/Channel";
import User from "App/Models/User";
import WebPushNotification from "App/Models/WebPushNotification";

export default class MessageRepository implements MessageRepositoryContract {
  private readonly MAX_NOTIFICATION_LENGTH = 50;

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

  public async notify(
    channelId: number,
    userId: number,
    message: string
  ): Promise<void> {
    const webPushNotifications = await Database.rawQuery<{
      rows: {
        endpoint: string;
        p256dh: string;
        auth: string;
      }[];
    }>(
      `
      SELECT
        wpn.endpoint,
        wpn.p256dh,
        wpn.auth
      FROM channel_users
        JOIN channels
          ON channels.id = channel_users.channel_id
        JOIN users
          ON users.id = channel_users.user_id
        JOIN web_push_notifications AS wpn
          ON wpn.user_id = users.id
      WHERE
        channels.id = ?
          AND
        users.id != ?
          AND
        users.status = 'ONLINE'
    `,
      [channelId, userId]
    );

    const channel = await Channel.findOrFail(channelId);

    for (const n of webPushNotifications.rows) {
      try {
        const response = await webPush.sendNotification(
          {
            endpoint: n.endpoint,
            keys: {
              auth: n.auth,
              p256dh: n.p256dh,
            },
          },
          JSON.stringify({
            channelName: channel.name,
            messageContent: message.substring(0, this.MAX_NOTIFICATION_LENGTH),
          })
        );

        console.log("WebPush:", response);
      } catch (err) {
        console.log("WebPushError:", err);

        await WebPushNotification.query()
          .where("endpoint", n.endpoint)
          .delete();
      }
    }
  }
}
