import UserTransformer from '#transformers/user_transformer'
import { updateProfileValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ProfileController {
  /**
   * GET /api/v1/account/profile
   * Returns the authenticated user's full private profile.
   */
  async show({ auth, serialize }: HttpContext) {
    return serialize(new UserTransformer(auth.getUserOrFail()).toObject())
  }

  /**
   * PUT /api/v1/account/profile
   * Updates the authenticated user's profile fields.
   */
  async update({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(updateProfileValidator)

    user.merge(data)

    // Mark profile as completed on first save that includes a skill level
    if (user.skillLevel && !user.profileCompletedAt) {
      user.profileCompletedAt = DateTime.now()
    }

    await user.save()

    return serialize(new UserTransformer(user).toObject())
  }
}
