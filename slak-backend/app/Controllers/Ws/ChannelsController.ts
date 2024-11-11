import type { WsContextContract } from "@ioc:Ruby184/Socket.IO/WsContext";
import Ws from "@ioc:Ruby184/Socket.IO/Ws";
import { inject } from "@adonisjs/core/build/standalone";
import { ChannelRepositoryContract } from "@ioc:Repositories/ChannelRepository";

import Channel from "App/Models/Channel";
import User from "App/Models/User";
import Kick from "App/Models/Kick";

import { ChannelType } from "App/Enums/ChannelType";
import { KickType } from "App/Enums/KickType";

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

    await Kick.query()
      .where("target_id", invitee.id)
      .andWhere("channel_id", channel.id)
      .delete();

    const serializedChannel = channel.serialize();
    const room = this.channelRepository.getUserRoom(invitee);
    Ws.io.of("/channels").to(room).emit("channel:invite", serializedChannel);
  }

  public async sendRevoke(
    { params, bouncer }: WsContextContract,
    nickName: string
  ) {
    const revokee = await User.findByOrFail("nickName", nickName);
    const channel = await Channel.findOrFail(params.channelId);

    await bouncer.with("ChannelPolicy").authorize("revoke", channel);
    await channel.related("users").detach([revokee.id]);
    await channel.related("invites").detach([revokee.id]);

    const room = this.channelRepository.getUserRoom(revokee);
    Ws.io.of("/channels").to(room).emit("channel:revoke", channel.id);
  }

  public async sendKick(
    { auth, params, bouncer }: WsContextContract,
    nickName: string
  ) {
    const user = auth.user!;
    const target = await User.findByOrFail("nickName", nickName);
    const channel = await Channel.findOrFail(params.channelId);

    await bouncer.with("ChannelPolicy").authorize("kick", channel);

    const kickType = user.id === channel.adminId ? KickType.Ban : KickType.Kick;

    await Kick.create({
      kickerId: user.id,
      targetId: target.id,
      channelId: channel.id,
      type: kickType,
    });

    const isBanned = await this.channelRepository.isBanned(channel, target);
    if (!isBanned) return;

    await channel.related("users").detach([target.id]);
    await channel.related("invites").detach([target.id]);

    const room = this.channelRepository.getUserRoom(target);
    Ws.io.of("/channels").to(room).emit("channel:kick", channel.id);
  }
}
