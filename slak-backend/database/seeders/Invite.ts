import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const user1 = await User.find(1);
    const channel2 = await Channel.find(2);

    await channel2!.related("invites").attach([user1!.id]);
  }
}
