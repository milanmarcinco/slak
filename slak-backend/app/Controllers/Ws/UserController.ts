import type { WsContextContract } from "@ioc:Ruby184/Socket.IO/WsContext";

export default class ActivityController {
  public async setNotifSetting({ auth }: WsContextContract, enabled: boolean) {
    const user = auth.user!;

    user.notifsEnabled = enabled;
    await user.save();

    return enabled;
  }
}
