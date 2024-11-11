import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

import Kick from "./Kick";
import Message from "./Message";
import User from "./User";

import { ChannelType } from "App/Enums/ChannelType";

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public adminId: number;

  @column()
  public type: ChannelType;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Message, { foreignKey: "channelId" })
  public messages: HasMany<typeof Message>;

  @hasMany(() => Kick, { foreignKey: "kickerId" })
  public kicks: HasMany<typeof Kick>;

  @manyToMany(() => User, {
    pivotTable: "channel_users",
    pivotForeignKey: "channel_id",
    pivotRelatedForeignKey: "user_id",
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>;

  @manyToMany(() => User, {
    pivotTable: "invites",
    pivotForeignKey: "channel_id",
    pivotRelatedForeignKey: "user_id",
    pivotTimestamps: true,
    pivotColumns: ["accepted"],
  })
  public invites: ManyToMany<typeof User>;
}
