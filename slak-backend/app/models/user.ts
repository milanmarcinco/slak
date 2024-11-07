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
import Message from "./Message";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Message, { foreignKey: "createdBy" })
  public messages: HasMany<typeof Message>;

  @manyToMany(() => Channel, {
    pivotTable: "channel_users",
    pivotForeignKey: "user_id",
    pivotRelatedForeignKey: "channel_id",
    pivotTimestamps: true,
  })
  public channels: ManyToMany<typeof Channel>;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
