import { ChannelRepositoryContract } from "@ioc:Repositories/ChannelRepository";
import { KickType } from "App/Enums/KickType";

import Channel from "App/Models/Channel";
import Kick from "App/Models/Kick";
import User from "App/Models/User";

export default class ChannelRepository implements ChannelRepositoryContract {
  public getUserRoom(user: User): string {
    return `user:${user.id}`;
  }

  public async isBanned(channel: Channel, user: User): Promise<boolean> {
    const kicksCounts = await Kick.query()
      .select("type")
      .count("*", "count")
      .where("target_id", user.id)
      .andWhere("channelId", channel.id)
      .groupBy("type");

    const kickCount: number | undefined = kicksCounts.find(
      (kick) => kick.type === KickType.Kick
    )?.["$extras"].count;

    const banCount: number | undefined = kicksCounts.find(
      (kick) => kick.type === KickType.Ban
    )?.["$extras"].count;

    const isKicked = typeof kickCount === "number" && kickCount >= 3;
    const isBanned = typeof banCount === "number" && banCount >= 1;

    return isKicked || isBanned;
  }
}
