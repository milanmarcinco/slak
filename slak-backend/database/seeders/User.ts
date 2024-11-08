import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    await User.updateOrCreateMany(
      ["email", "nickName"],
      [
        {
          email: "xmarcinco@stuba.sk",
          password: "xmarcinco123",
          firstName: "Milan",
          lastName: "Marcinco",
          nickName: "xmarcinco",
        },
        {
          email: "xhnatko@stuba.sk",
          password: "xhnatko123",
          firstName: "Martin",
          lastName: "Hnatko",
          nickName: "xhnatko",
        },
      ]
    );
  }
}
