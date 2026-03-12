import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Court from '#models/court'

export default class CourtGroup extends BaseModel {
  static table = 'court_groups'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare courtId: number

  @column()
  declare name: string

  @column()
  declare courtCount: number

  @column()
  declare sessionTimeMinutes: number | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Court)
  declare court: BelongsTo<typeof Court>
}
