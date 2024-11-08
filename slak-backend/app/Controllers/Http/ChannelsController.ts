import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ChannelsController {
  async loadChannels({ auth }: HttpContextContract) {
    const user = auth.user!;
    const channels = await user.related("channels").query();

    return channels;
  }
}
