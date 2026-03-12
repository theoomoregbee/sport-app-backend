import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'court_groups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('court_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('courts')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.integer('court_count').notNullable().defaultTo(1)
      table.integer('session_time_minutes').nullable()
      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
