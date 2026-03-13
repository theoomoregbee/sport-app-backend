import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  constructor(
    resource: User,
    private readonly publicView = false
  ) {
    super(resource)
  }

  toObject() {
    const base = this.pick(this.resource, [
      'id',
      'email',
      'isAmbassador',
      'isSuperAdmin',
      'createdAt',
      'updatedAt',
      'initials',
      'skillLevel',
      'playStyle',
      'preferredTimes',
      'homeCourtIds',
      'bio',
      'avatarUrl',
      'hideName',
      'profileCompletedAt',
    ])

    // Respect the user's privacy setting — omit real name on public profile views
    const fullName = this.publicView && this.resource.hideName ? null : this.resource.fullName

    return { ...base, fullName }
  }

  static transformPublic(user: User) {
    return new UserTransformer(user, true).toObject()
  }
}
