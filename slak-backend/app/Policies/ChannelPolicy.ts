import { inject } from "@adonisjs/core/build/standalone";
import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import { ChannelRepositoryContract } from "@ioc:Repositories/ChannelRepository";

import Channel from "App/Models/Channel";
import User from "App/Models/User";

import { ChannelType } from "App/Enums/ChannelType";

@inject(["Repositories/ChannelRepository"])
export default class ChannelPolicy extends BasePolicy {
  constructor(private channelRepository: ChannelRepositoryContract) {
    super();
  }

  public async join(user: User, channel: Channel) {
    const isPublic = channel.type === ChannelType.Public;
    const isAdmin = channel.adminId === user.id;
    const isBanned = await this.channelRepository.isBanned(channel, user);

    return !isBanned && (isPublic || isAdmin);
  }

  public async invite(user: User, channel: Channel) {
    const isPublic = channel.type === ChannelType.Public;
    const isAdmin = channel.adminId === user.id;

    return isPublic || isAdmin;
  }

  public async revoke(user: User, channel: Channel) {
    return channel.adminId === user.id;
  }

  public async kick(user: User, channel: Channel) {
    return !!(await user
      .related("channels")
      .query()
      .where("channels.id", channel.id)
      .andWhere((query) => {
        query.where("admin_id", user.id);
        query.orWhere("type", ChannelType.Public);
      })
      .first());
  }
}
