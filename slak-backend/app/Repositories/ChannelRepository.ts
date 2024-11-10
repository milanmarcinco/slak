import { ChannelRepositoryContract } from "@ioc:Repositories/ChannelRepository";
import User from "App/Models/User";

export default class ChannelRepository implements ChannelRepositoryContract {
  public getUserRoom(user: User): string {
    return `user:${user.id}`;
  }
}
