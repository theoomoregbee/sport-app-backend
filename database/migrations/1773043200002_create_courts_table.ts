import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'courts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.string('address').nullable()
      table.decimal('latitude', 10, 7).notNullable()
      table.decimal('longitude', 10, 7).notNullable()
      table.string('photo_url').nullable()
      table.integer('total_court_count').notNullable().defaultTo(0)
      table.boolean('is_priority').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
