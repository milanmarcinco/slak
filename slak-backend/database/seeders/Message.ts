import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const user1 = await User.find(1);
    const user2 = await User.find(2);

    const channel1 = await Channel.find(1);
    const channel2 = await Channel.find(2);

    if (user1 && channel1) {
      await channel1.related("messages").createMany([
        {
          userId: user1.id,
          content: "Hello, World!",
        },
        {
          userId: user1.id,
          content: "This is a test message",
        },
      ]);
    }

    if (user2 && channel2) {
      await channel2.related("messages").createMany([
        {
          userId: user2.id,
          content: "Another test message",
        },
        {
          userId: user2.id,
          content: "This is a secret message",
        },
      ]);
    }
  }
}
