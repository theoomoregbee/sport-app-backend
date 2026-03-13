import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'check_ins'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enu('source', ['user', 'admin']).notNullable().defaultTo('user')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('source')
    })
  }
}
