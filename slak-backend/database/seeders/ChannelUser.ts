import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const users = await User.query().orderBy("id", "asc");
    const channels = await Channel.query().orderBy("id", "asc");

    await channels[0].related("users").attach(users.map((u) => u.id));
    await channels[1].related("users").attach([users[0].id]);
    await channels[2].related("users").attach(users.map((u) => u.id));
    await channels[3].related("users").attach([users[0].id]);
  }
}
