import Hash from "@ioc:Adonis/Core/Hash";
import { DateTime } from "luxon";

import {
  BaseModel,
  beforeSave,
  column,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";

import Channel from "./Channel";
import Kick from "./Kick";
import Message from "./Message";

import { UserStatus } from "App/Enums/UserStatus";
import WebPushNotification from "./WebPushNotification";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column()
  public nickName: string;

  @column()
  public firstName: string;

  @column()
  public lastName: string;

  @column()
  public status: UserStatus;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => WebPushNotification, { foreignKey: "userId" })
  public webPushNotifications: HasMany<typeof WebPushNotification>;

  @hasMany(() => Message, { foreignKey: "userId" })
  public messages: HasMany<typeof Message>;

  @hasMany(() => Kick, { foreignKey: "kickerId" })
  public kicks: HasMany<typeof Kick>;

  @manyToMany(() => Channel, {
    pivotTable: "channel_users",
    pivotForeignKey: "user_id",
    pivotRelatedForeignKey: "channel_id",
    pivotTimestamps: true,
  })
  public channels: ManyToMany<typeof Channel>;

  @manyToMany(() => Channel, {
    pivotTable: "invites",
    pivotForeignKey: "user_id",
    pivotRelatedForeignKey: "channel_id",
    pivotTimestamps: true,
  })
  public invites: ManyToMany<typeof Channel>;

  @manyToMany(() => Message, {
    pivotTable: "mentions",
    pivotForeignKey: "user_id",
    pivotRelatedForeignKey: "message_id",
    pivotTimestamps: true,
  })
  public mentions: ManyToMany<typeof Message>;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
