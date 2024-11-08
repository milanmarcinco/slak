import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const user1 = await User.find(1);
    const user2 = await User.find(2);
    const channel1 = await Channel.find(1);
    const channel2 = await Channel.find(2);

    if (user1 && user2 && channel1) {
      await user1.related("channels").attach([channel1.id]);
      await user2.related("channels").attach([channel1.id]);
    }

    if (user1 && user2 && channel2) {
      await user1.related("channels").attach([channel2.id]);
      await user2.related("channels").attach([channel2.id]);
    }
  }
}
