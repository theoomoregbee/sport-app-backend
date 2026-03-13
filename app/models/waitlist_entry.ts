import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class WaitlistEntry extends BaseModel {
  static table = 'waitlist_entries'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare source: string

  @column()
  declare referrer: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
