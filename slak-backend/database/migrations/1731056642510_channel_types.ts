import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "channels";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum("type", ["PUBLIC", "PRIVATE"]).notNullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("type");
    });
  }
}
