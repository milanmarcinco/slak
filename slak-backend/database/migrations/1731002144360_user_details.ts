import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable("users", (table) => {
      table.string("nick_name", 31).notNullable().unique();
      table.string("first_name", 255).notNullable();
      table.string("last_name", 255).notNullable();
    });
  }

  public async down() {
    this.schema.alterTable("users", (table) => {
      table.dropColumns("nick_name", "first_name", "last_name");
    });
  }
}
