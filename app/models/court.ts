import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import CourtGroup from '#models/court_group'
import CheckIn from '#models/check_in'

export default class Court extends BaseModel {
  static table = 'courts'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare address: string | null

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare photoUrl: string | null

  @column()
  declare totalCourtCount: number

  @column()
  declare isPriority: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => CourtGroup)
  declare courtGroups: HasMany<typeof CourtGroup>

  @hasMany(() => CheckIn)
  declare checkIns: HasMany<typeof CheckIn>
}
