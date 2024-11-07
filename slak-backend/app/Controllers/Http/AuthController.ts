import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

// import Channel from "App/Models/Channel";
import User from "App/Models/User";

import RegisterUserValidator from "App/Validators/RegisterUserValidator";

export default class AuthController {
  async register({ auth, request }: HttpContextContract) {
    const data = await request.validate(RegisterUserValidator);
    await User.create(data);
    // const user = await User.create(data);

    // const general = await Channel.findByOrFail("name", "general");
    // await user.related("channels").attach([general.id]);

    return auth.use("api").attempt(data.email, data.password);
  }

  async login({ auth, request }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    return auth.use("api").attempt(email, password);
  }

  async logout({ auth }: HttpContextContract) {
    await auth.use("api").logout();
    return {};
  }

  async me({ auth }: HttpContextContract) {
    await auth.user!.load("channels");
    return auth.user;
  }
}
