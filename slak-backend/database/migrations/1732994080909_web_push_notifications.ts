import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "web_push_notifications";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");

      table.string("endpoint").notNullable();
      table.string("p256dh").notNullable();
      table.string("auth").notNullable();

      table.index("endpoint");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
