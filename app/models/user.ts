import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'competitive'
export type PlayStyle = 'singles' | 'doubles' | 'rally' | 'lessons'
export type PreferredTime = 'weekday_mornings' | 'weekday_evenings' | 'weekends'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @column()
  declare phone: string | null

  @column()
  declare isAmbassador: boolean

  @column()
  declare isSuperAdmin: boolean

  // ── Profile fields ──────────────────────────────────────────────────────────

  @column()
  declare skillLevel: SkillLevel | null

  @column({
    prepare: (v) => (v ? JSON.stringify(v) : null),
    consume: (v) => (typeof v === 'string' ? JSON.parse(v) : (v ?? null)),
  })
  declare playStyle: PlayStyle[] | null

  @column({
    prepare: (v) => (v ? JSON.stringify(v) : null),
    consume: (v) => (typeof v === 'string' ? JSON.parse(v) : (v ?? null)),
  })
  declare preferredTimes: PreferredTime[] | null

  @column({
    prepare: (v) => (v ? JSON.stringify(v) : null),
    consume: (v) => (typeof v === 'string' ? JSON.parse(v) : (v ?? null)),
  })
  declare homeCourtIds: string[] | null

  @column()
  declare bio: string | null

  @column()
  declare avatarUrl: string | null

  @column()
  declare hideName: boolean

  @column()
  declare showToOthers: boolean

  @column.dateTime()
  declare profileCompletedAt: DateTime | null

  // ── Computed ────────────────────────────────────────────────────────────────

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
