import MatchRequest from '#models/match_request'
import Court from '#models/court'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { createMatchRequestValidator } from '#validators/match_request'

function formatRequest(r: MatchRequest) {
  return {
    id: r.id,
    courtId: r.courtId,
    skillLevels: r.skillLevels,
    scheduledFor: r.scheduledFor?.toISO() ?? null,
    message: r.message,
    status: r.status,
    expiresAt: r.expiresAt.toISO(),
    createdAt: r.createdAt.toISO(),
    user: r.user
      ? {
          id: r.user.id,
          initials: r.user.initials,
          fullName: r.user.hideName ? null : r.user.fullName,
          skillLevel: r.user.skillLevel,
        }
      : null,
  }
}

export default class MatchRequestsController {
  /**
   * GET /api/v1/courts/:courtId/match-requests
   * Active match requests for a court — public read.
   */
  async index({ params, response }: HttpContext) {
    const court = await Court.find(params.courtId)
    if (!court) return response.notFound({ message: 'Court not found' })

    const now = DateTime.utc()
    const requests = await MatchRequest.query()
      .where('court_id', params.courtId)
      .where('status', 'open')
      .where('expires_at', '>', now.toISO())
      .preload('user')
      .orderBy('created_at', 'asc')

    return { requests: requests.map(formatRequest) }
  }

  /**
   * GET /api/v1/match-requests/mine
   * Current user's open match requests.
   */
  async mine({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const now = DateTime.utc()

    const requests = await MatchRequest.query()
      .where('user_id', user.id)
      .where('status', 'open')
      .where('expires_at', '>', now.toISO())
      .orderBy('created_at', 'desc')

    return { requests: requests.map((r) => formatRequest(r)) }
  }

  /**
   * POST /api/v1/match-requests
   * Create a new match request. Cancels any existing open request at the same court.
   */
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createMatchRequestValidator)

    // Cancel any open request this user already has at this court
    await MatchRequest.query()
      .where('user_id', user.id)
      .where('court_id', data.courtId)
      .where('status', 'open')
      .update({ status: 'cancelled' })

    const matchRequest = await MatchRequest.create({
      userId: user.id,
      courtId: data.courtId,
      skillLevels: data.skillLevels,
      scheduledFor: data.scheduledFor ? DateTime.fromISO(data.scheduledFor, { zone: 'utc' }) : null,
      message: data.message ?? null,
      status: 'open',
      expiresAt: DateTime.utc().plus({ hours: 2 }),
    })

    return { request: formatRequest(matchRequest) }
  }

  /**
   * DELETE /api/v1/match-requests/:id
   * Cancel own match request.
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const matchRequest = await MatchRequest.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .first()

    if (!matchRequest) return response.notFound({ message: 'Match request not found' })

    matchRequest.status = 'cancelled'
    await matchRequest.save()

    return { ok: true }
  }

  /**
   * POST /api/v1/match-requests/:id/respond
   * Respond to someone's match request — marks it as matched.
   */
  async respond({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const matchRequest = await MatchRequest.query()
      .where('id', params.id)
      .where('status', 'open')
      .where('expires_at', '>', DateTime.utc().toISO())
      .preload('user')
      .first()

    if (!matchRequest) {
      return response.notFound({ message: 'Match request not found or no longer open' })
    }
    if (matchRequest.userId === user.id) {
      return response.badRequest({ message: 'Cannot respond to your own request' })
    }

    matchRequest.status = 'matched'
    matchRequest.responderUserId = user.id
    await matchRequest.save()

    return {
      ok: true,
      requester: {
        id: matchRequest.user.id,
        initials: matchRequest.user.initials,
        fullName: matchRequest.user.hideName ? null : matchRequest.user.fullName,
        skillLevel: matchRequest.user.skillLevel,
      },
    }
  }
}
