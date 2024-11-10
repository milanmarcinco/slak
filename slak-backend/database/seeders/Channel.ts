import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

import { ChannelType } from "App/Enums/ChannelType";
import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const uniqueKey = "name";

    const user1 = await User.find(1);
    const user2 = await User.find(2);

    await Channel.updateOrCreateMany(uniqueKey, [
      {
        name: "general",
        type: ChannelType.Public,
        adminId: user1!.id,
      },
      {
        name: "general inv",
        type: ChannelType.Public,
        adminId: user1!.id,
      },
      {
        name: "s3cret",
        type: ChannelType.Private,
        adminId: user2!.id,
      },
      {
        name: "s3cret inv",
        type: ChannelType.Private,
        adminId: user2!.id,
      },
    ]);
  }
}
