import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const user1 = await User.find(1);
    const user2 = await User.find(2);

    const channels = await Channel.query().orderBy("id", "asc");

    await user1!.related("channels").attach(channels.map((c) => c.id));
    await user2!.related("channels").attach([channels[2].id, channels[3].id]);
  }
}
