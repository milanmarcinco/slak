import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
  scope,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";

import Channel from "./Channel";
import User from "./User";

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public content: string;

  @column()
  public userId: number;

  @column()
  public channelId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, { foreignKey: "userId" })
  public author: BelongsTo<typeof User>;

  @belongsTo(() => Channel, { foreignKey: "channelId" })
  public channel: BelongsTo<typeof Channel>;

  @manyToMany(() => User, {
    pivotTable: "mentions",
    pivotForeignKey: "message_id",
    pivotRelatedForeignKey: "user_id",
    pivotTimestamps: true,
  })
  public mentions: ManyToMany<typeof User>;

  public static beforeMessage = scope(
    (query, beforeMessage?: Message | null) => {
      if (beforeMessage) {
        query.andWhere("createdAt", "<", beforeMessage.createdAt.toSQL()!);
        query.andWhereNot("id", beforeMessage.id);
      }
    }
  );
}
