import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'check_ins'

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
      table
        .integer('court_group_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('court_groups')
        .onDelete('SET NULL')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.enum('status', ['empty', 'moderate', 'packed']).notNullable()
      table.integer('rackets_waiting').nullable()
      table.decimal('latitude', 10, 7).notNullable()
      table.decimal('longitude', 10, 7).notNullable()
      table.decimal('confidence_weight', 4, 2).notNullable().defaultTo(1.0)

      table.timestamp('created_at').notNullable()

      // Index for fast status queries per court
      table.index(['court_id', 'created_at'], 'check_ins_court_id_created_at_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
