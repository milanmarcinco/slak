import Database from "@ioc:Adonis/Lucid/Database";
import Ws from "@ioc:Ruby184/Socket.IO/Ws";
import {
  BaseTask,
  CronTimeV2,
} from "adonis5-scheduler/build/src/Scheduler/Task";

import Channel from "App/Models/Channel";

export default class DeleteOldChannel extends BaseTask {
  public static get schedule() {
    return CronTimeV2.everyMinute();
  }

  public static get useLock() {
    return false;
  }

  public async handle() {
    this.logger.info("Removing old channels...");

    const result = await Database.rawQuery<{
      rows: { id: number }[];
    }>(`
      SELECT
        id
      FROM (
        SELECT
          channels.id,
          NOW() - MAX(
            COALESCE(
              messages.created_at,
              channels.created_at
            )
          ) AS delta
        FROM
          channels
        LEFT JOIN
          messages
            ON messages.channel_id = channels.id
        GROUP BY
          channels.id
      )
      WHERE
        EXTRACT(DAY FROM delta) >= 30
    `);

    const ids = result.rows.map((row) => row.id);
    const channels = await Channel.findMany(ids);

    for (const channel of channels) {
      await channel.delete();
      Ws.io.of(`/channels/${channel.id}`).emit("channel:delete");
    }

    this.logger.info("Old channels removed.");
  }
}
