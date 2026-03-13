import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Court from '#models/court'
import User from '#models/user'

export default class Presence extends BaseModel {
  static table = 'presences'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare courtId: number

  @column.dateTime()
  declare enteredAt: DateTime

  @column.dateTime()
  declare lastHeartbeatAt: DateTime

  @belongsTo(() => Court)
  declare court: BelongsTo<typeof Court>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
