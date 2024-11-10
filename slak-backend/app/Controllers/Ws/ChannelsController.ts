import type { WsContextContract } from "@ioc:Ruby184/Socket.IO/WsContext";
import Ws from "@ioc:Ruby184/Socket.IO/Ws";
import { inject } from "@adonisjs/core/build/standalone";
import { ChannelRepositoryContract } from "@ioc:Repositories/ChannelRepository";

import Channel from "App/Models/Channel";
import User from "App/Models/User";

import { ChannelType } from "App/Enums/ChannelType";

@inject(["Repositories/ChannelRepository"])
export default class ChannelController {
  constructor(private channelRepository: ChannelRepositoryContract) {}

  public async onConnected({ auth, socket }: WsContextContract) {
    const room = this.channelRepository.getUserRoom(auth.user!);
    socket.join(room);
  }

  public async joinChannel(
    { auth, bouncer }: WsContextContract,
    {
      channelName,
      channelType,
    }: {
      channelName: string;
      channelType: ChannelType;
    }
  ) {
    const user = auth.user!;
    let channel = await Channel.findBy("name", channelName);

    if (!channel) {
      channel = await Channel.create({
        adminId: user.id,
        name: channelName,
        type: channelType,
      });
    }

    await bouncer.with("ChannelPolicy").authorize("join", channel);
    await channel.related("users").attach([user.id]);

    return channel.serialize();
  }

  public async leaveChannel({ auth, params, socket }: WsContextContract) {
    const user = auth.user!;
    const channel = await Channel.findOrFail(params.channelId);

    if (channel.adminId === user.id) {
      await channel.delete();
      socket.broadcast.emit("channel:delete");
      return;
    }

    await channel.related("users").detach([user.id]);
  }

  public async sendInvite(
    { params, bouncer }: WsContextContract,
    nickName: string
  ) {
    const invitee = await User.findByOrFail("nickName", nickName);
    const channel = await Channel.findOrFail(params.channelId);

    await bouncer.with("ChannelPolicy").authorize("invite", channel);

    await channel.related("users").attach([invitee.id]);
    await channel.related("invites").attach([invitee.id]);

    const serializedChannel = channel.serialize();
    const room = this.channelRepository.getUserRoom(invitee);
    Ws.io.of("/channels").to(room).emit("channel:invite", serializedChannel);
  }
}
