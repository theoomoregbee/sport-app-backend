import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'match_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
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
      table.jsonb('skill_levels').notNullable().defaultTo('[]')
      table.timestamp('scheduled_for').nullable()
      table.text('message').nullable()
      table.enum('status', ['open', 'matched', 'cancelled', 'expired']).notNullable().defaultTo('open')
      table.integer('responder_user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['court_id', 'status', 'expires_at'], 'match_requests_court_status_expires_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
