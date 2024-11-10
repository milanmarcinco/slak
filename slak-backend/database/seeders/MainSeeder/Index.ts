import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run();
  }

  public async run() {
    await this.runSeeder(await import("../User"));
    await this.runSeeder(await import("../Channel"));
    await this.runSeeder(await import("../ChannelUser"));
    await this.runSeeder(await import("../Invite"));
    await this.runSeeder(await import("../Message"));
  }
}
