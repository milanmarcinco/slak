import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

import Channel from "./Channel";
import User from "./User";

import { KickType } from "App/Enums/KickType";

export default class Kick extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public kickerId: number;

  @column()
  public targetId: number;

  @column()
  public channelId: number;

  @column()
  public type: KickType;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, { foreignKey: "kickerId" })
  public kicker: BelongsTo<typeof User>;

  @belongsTo(() => User, { foreignKey: "targetId" })
  public target: BelongsTo<typeof User>;

  @belongsTo(() => Channel, { foreignKey: "channelId" })
  public channel: BelongsTo<typeof Channel>;
}
