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
        {
          email: "xkacmar@stuba.sk",
          password: "xkacmar123",
          firstName: "Adam",
          lastName: "Kacmar",
          nickName: "xkacmar",
        },
        {
          email: "xfico@stuba.sk",
          password: "xfico123",
          firstName: "John",
          lastName: "Doe",
          nickName: "xfico",
        },
        {
          email: "xkotleba@stuba.sk",
          password: "xkotleba123",
          firstName: "John",
          lastName: "Smith",
          nickName: "xkotleba",
        },
      ]
    );
  }
}
