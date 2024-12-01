import Env from "@ioc:Adonis/Core/Env";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import WebPushNotification from "App/Models/WebPushNotification";

import SubscribeWebPushValidator from "App/Validators/SubscribeWebPushValidator";

export default class WebPushController {
  public async getVapidPublicKey({}: HttpContextContract) {
    return Env.get("VAPID_PUBLIC_KEY");
  }

  public async subscribe({ auth, request }: HttpContextContract) {
    const user = auth.user!;
    const { subscription } = await request.validate(SubscribeWebPushValidator);

    await WebPushNotification.updateOrCreate(
      {
        endpoint: subscription.endpoint,
      },
      {
        userId: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      }
    );

    return {};
  }
}
