import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";

import Channel from "App/Models/Channel";
import User from "App/Models/User";

import { ChannelType } from "App/Enums/ChannelType";

export default class ChannelPolicy extends BasePolicy {
  public async join(user: User, channel: Channel) {
    const isPublic = channel.type === ChannelType.Public;
    const isAdmin = channel.adminId === user.id;

    return isPublic || isAdmin;
  }

  public async invite(user: User, channel: Channel) {
    const isPublic = channel.type === ChannelType.Public;
    const isAdmin = channel.adminId === user.id;

    return isPublic || isAdmin;
  }

  public async revoke(user: User, channel: Channel) {
    return channel.adminId === user.id;
  }
}
