import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'presences'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('court_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('courts')
        .onDelete('CASCADE')
      table.timestamp('entered_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('last_heartbeat_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.unique(['user_id', 'court_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
