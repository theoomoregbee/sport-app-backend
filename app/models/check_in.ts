import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Court from '#models/court'
import CourtGroup from '#models/court_group'
import User from '#models/user'

export type CheckInStatus = 'empty' | 'moderate' | 'packed'

export default class CheckIn extends BaseModel {
  static table = 'check_ins'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare courtId: number

  @column()
  declare courtGroupId: number | null

  @column()
  declare userId: number

  @column()
  declare status: CheckInStatus

  @column()
  declare racketsWaiting: number | null

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare confidenceWeight: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Court)
  declare court: BelongsTo<typeof Court>

  @belongsTo(() => CourtGroup)
  declare courtGroup: BelongsTo<typeof CourtGroup>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
