import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * GET /api/v1/users/:id/profile
   * Public profile view — respects the user's hide_name setting.
   */
  async profile({ params, response, serialize }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) return response.notFound({ message: 'User not found' })
    return serialize(UserTransformer.transformPublic(user))
  }
}
