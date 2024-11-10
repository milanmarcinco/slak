import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { SerializedChannelWithInvite } from "@ioc:Repositories/ChannelRepository";

export default class ChannelsController {
  async loadChannels({ auth }: HttpContextContract) {
    const user = auth.user!;

    const { rows: channels } = await Database.rawQuery<{
      rows: SerializedChannelWithInvite[];
    }>(
      `
      SELECT
        channels.*,
        invites.id IS NOT NULL AS invite
      FROM
        channels
      LEFT JOIN
        channel_users
          ON channel_users.channel_id = channels.id
      LEFT JOIN
        invites
          ON invites.channel_id = channels.id
            AND invites.user_id = :user_id
      LEFT JOIN (
        SELECT
          channel_id,
          MAX(created_at) AS created_at
        FROM
          messages
        GROUP BY
          channel_id
      ) AS last_messages
        ON last_messages.channel_id = channels.id
      WHERE
        channel_users.user_id = :user_id
      ORDER BY
        last_messages.created_at DESC,
        channels.id DESC
    `,
      {
        user_id: user.id,
      }
    );

    return channels;
  }
}
