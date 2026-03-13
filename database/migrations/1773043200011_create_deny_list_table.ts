import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deny_list'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('type', ['ip', 'api_key']).notNullable()
      table.string('value', 255).notNullable()
      table.string('reason', 500).nullable()
      table.timestamp('expires_at', { useTz: true }).nullable() // null = permanent
      table.timestamp('created_at', { useTz: true }).notNullable()

      table.index(['type', 'value'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
