import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

import { ChannelType } from "App/Enums/ChannelType";
import Channel from "App/Models/Channel";

export default class extends BaseSeeder {
  public async run() {
    const uniqueKey = "name";

    await Channel.updateOrCreateMany(uniqueKey, [
      {
        name: "general",
        type: ChannelType.Public,
      },
      {
        name: "s3cret",
        type: ChannelType.Private,
      },
    ]);
  }
}
