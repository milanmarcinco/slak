import type { WsContextContract } from "@ioc:Ruby184/Socket.IO/WsContext";
import { inject } from "@adonisjs/core/build/standalone";
// import { ChannelRepositoryContract } from "@ioc:Repositories/ChannelRepository";
import Channel from "App/Models/Channel";
import { ChannelType } from "App/Enums/ChannelType";

@inject(["Repositories/ChannelRepository"])
export default class ChannelController {
  constructor(/* private channelRepository: ChannelRepositoryContract */) {}

  public async joinChannel(
    { auth }: WsContextContract,
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

    await channel.related("users").attach([user.id]);

    return channel.serialize();
  }
}
