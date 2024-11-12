import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const user2 = await User.find(2);
    const channel3 = await Channel.find(3);

    await channel3!.related("invites").attach([user2!.id]);
  }
}
