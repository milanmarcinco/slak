import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { SerializedChannelWithInvite } from "@ioc:Repositories/ChannelRepository";

import Channel from "App/Models/Channel";

import { deepCamelCase } from "Lib/deepCamelCase";

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
        channels.created_at DESC,
        channels.id DESC
    `,
      {
        user_id: user.id,
      }
    );

    return deepCamelCase(channels);
  }

  async loadUsers({ auth, request, params, bouncer }: HttpContextContract) {
    const user = auth.user!;

    const limit: number = request.input("limit", 10);
    const offset: number = request.input("offset", 0);
    const query: string = request.input("query", "");
    const sqlQueryString = `%${query}%`;

    const channel = await Channel.findOrFail(params.channelId);
    await bouncer.with("ChannelPolicy").authorize("viewUsers", channel);

    const users = await channel
      .related("users")
      .query()
      .where((query) => {
        if (!query) return;

        query
          .where("first_name", "ilike", sqlQueryString)
          .orWhere("last_name", "ilike", sqlQueryString)
          .orWhere("nick_name", "ilike", sqlQueryString)
          .orWhere("email", "ilike", sqlQueryString);
      })
      .andWhereNot("users.id", user.id)
      .offset(offset)
      .limit(limit);

    return users;
  }
}
