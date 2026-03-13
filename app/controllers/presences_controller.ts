import Presence from '#models/presence'
import Court from '#models/court'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'

const storeValidator = vine.compile(
  vine.object({
    headingHere: vine.boolean().optional(),
    etaMinutes: vine.number().min(1).max(120).optional(),
  })
)

const ACTIVE_WINDOW_MINS = 30
const HEADING_HERE_WINDOW_HOURS = 2

export default class PresencesController {
  /**
   * GET /api/v1/presence/:courtId
   * Return opted-in users currently at or heading to the court.
   * No auth required — public read behind API key.
   */
  async index({ params, response }: HttpContext) {
    const court = await Court.find(params.courtId)
    if (!court) {
      return response.notFound({ message: 'Court not found' })
    }

    const cutoffActive = DateTime.utc().minus({ minutes: ACTIVE_WINDOW_MINS })
    const cutoffHeading = DateTime.utc().minus({ hours: HEADING_HERE_WINDOW_HOURS })

    const presences = await Presence.query()
      .where('court_id', court.id)
      .where((q) => {
        // Here now: heartbeat within 30 min, not heading here
        q.where((sub) => {
          sub
            .where('is_heading_here', false)
            .where('last_heartbeat_at', '>=', cutoffActive.toISO())
        })
        // OR heading here: updated within 2 hours
        .orWhere((sub) => {
          sub
            .where('is_heading_here', true)
            .where('last_heartbeat_at', '>=', cutoffHeading.toISO())
        })
      })
      .preload('user')

    const users = presences
      .filter((p) => p.user?.showToOthers)
      .map((p) => ({
        id: p.user.id,
        initials: p.user.initials,
        fullName: p.user.hideName ? null : p.user.fullName,
        skillLevel: p.user.skillLevel,
        isHeadingHere: p.isHeadingHere,
        etaMinutes: p.etaMinutes,
        enteredAt: p.enteredAt.toISO(),
      }))

    return { users }
  }

  /**
   * PUT /api/v1/presence/:courtId
   * Enter a court, send heartbeat, or mark as heading here.
   */
  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const court = await Court.find(params.courtId)
    if (!court) {
      return response.notFound({ message: 'Court not found' })
    }

    const { headingHere = false, etaMinutes = null } = await request.validateUsing(storeValidator)

    const now = DateTime.utc()
    const existing = await Presence.query()
      .where('user_id', user.id)
      .where('court_id', court.id)
      .first()

    if (existing) {
      existing.lastHeartbeatAt = now
      existing.isHeadingHere = headingHere
      existing.etaMinutes = headingHere ? (etaMinutes ?? null) : null
      await existing.save()
    } else {
      await Presence.create({
        userId: user.id,
        courtId: court.id,
        enteredAt: now,
        lastHeartbeatAt: now,
        isHeadingHere: headingHere,
        etaMinutes: headingHere ? (etaMinutes ?? null) : null,
      })
    }

    return { ok: true }
  }

  /**
   * DELETE /api/v1/presence/:courtId
   * Exit a court — remove the presence record immediately.
   */
  async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()

    await Presence.query()
      .where('user_id', user.id)
      .where('court_id', params.courtId)
      .delete()

    return { ok: true }
  }
}
