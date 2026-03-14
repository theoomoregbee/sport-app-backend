import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Court from '#models/court'
import User from '#models/user'

export type MatchRequestStatus = 'open' | 'matched' | 'cancelled' | 'expired'

export default class MatchRequest extends BaseModel {
  static table = 'match_requests'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare courtId: number

  @column({
    prepare: (v) => (v ? JSON.stringify(v) : '[]'),
    consume: (v) => (typeof v === 'string' ? JSON.parse(v) : (v ?? [])),
  })
  declare skillLevels: string[]

  @column.dateTime()
  declare scheduledFor: DateTime | null

  @column()
  declare message: string | null

  @column()
  declare status: MatchRequestStatus

  @column()
  declare responderUserId: number | null

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Court)
  declare court: BelongsTo<typeof Court>

  @belongsTo(() => User, { foreignKey: 'responderUserId' })
  declare responder: BelongsTo<typeof User>
}
