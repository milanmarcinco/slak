import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

import Channel from "./Channel";
import User from "./User";

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public content: string;

  @column()
  public createdBy: number;

  @column()
  public channelId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, { foreignKey: "createdBy" })
  public author: BelongsTo<typeof User>;

  @belongsTo(() => Channel, { foreignKey: "channelId" })
  public channel: BelongsTo<typeof Channel>;
}
