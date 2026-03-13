import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('skill_level', ['beginner', 'intermediate', 'advanced', 'competitive'])
        .nullable()
      table.jsonb('play_style').nullable()        // string[] e.g. ['singles','doubles']
      table.jsonb('preferred_times').nullable()   // string[] e.g. ['weekday_mornings','weekends']
      table.jsonb('home_court_ids').nullable()    // string[] of court IDs
      table.text('bio').nullable()
      table.string('avatar_url', 500).nullable()
      table.boolean('hide_name').notNullable().defaultTo(false)
      table.timestamp('profile_completed_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'skill_level',
        'play_style',
        'preferred_times',
        'home_court_ids',
        'bio',
        'avatar_url',
        'hide_name',
        'profile_completed_at'
      )
    })
  }
}
