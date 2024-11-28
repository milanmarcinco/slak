import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum("status", ["ONLINE", "OFFLINE", "DO_NOT_DISTURB"])
        .defaultTo("ONLINE")
        .notNullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("status");
    });
  }
}
