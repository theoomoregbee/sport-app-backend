import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'presences'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_heading_here').notNullable().defaultTo(false)
      table.integer('eta_minutes').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_heading_here')
      table.dropColumn('eta_minutes')
    })
  }
}
