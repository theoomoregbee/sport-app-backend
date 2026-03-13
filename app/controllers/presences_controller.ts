import Presence from '#models/presence'
import Court from '#models/court'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class PresencesController {
  /**
   * PUT /api/v1/presence/:courtId
   * Enter a court or send a heartbeat to confirm the user is still present.
   * Creates a new record on first call; updates last_heartbeat_at on subsequent calls.
   */
  async store({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const court = await Court.find(params.courtId)
    if (!court) {
      return response.notFound({ message: 'Court not found' })
    }

    const now = DateTime.utc()
    const existing = await Presence.query()
      .where('user_id', user.id)
      .where('court_id', court.id)
      .first()

    if (existing) {
      existing.lastHeartbeatAt = now
      await existing.save()
    } else {
      await Presence.create({
        userId: user.id,
        courtId: court.id,
        enteredAt: now,
        lastHeartbeatAt: now,
      })
    }

    return { ok: true }
  }

  /**
   * DELETE /api/v1/presence/:courtId
   * Exit a court — remove the presence record immediately.
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await Presence.query()
      .where('user_id', user.id)
      .where('court_id', params.courtId)
      .delete()

    return { ok: true }
  }
}
