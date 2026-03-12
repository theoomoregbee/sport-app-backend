import CheckIn from '#models/check_in'
import Court from '#models/court'
import { haversineDistance, MAX_CHECKIN_DISTANCE_METRES } from '#services/location_service'
import CheckInTransformer from '#transformers/check_in_transformer'
import { createCheckInValidator } from '#validators/check_in'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

export default class CheckInsController {
  /**
   * POST /api/check-ins
   * Submit a check-in. Requires auth + proximity to the court.
   */
  async store({ auth, request, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createCheckInValidator)

    const court = await Court.find(data.courtId)
    if (!court) {
      return response.notFound({ message: 'Court not found' })
    }

    // Server-side location verification
    const distanceMetres = haversineDistance(
      data.latitude,
      data.longitude,
      Number(court.latitude),
      Number(court.longitude)
    )

    const devAdminBypass = app.inDev && user.isAmbassador
    if (!devAdminBypass && distanceMetres > MAX_CHECKIN_DISTANCE_METRES) {
      return response.unprocessableEntity({
        message: `You must be within ${MAX_CHECKIN_DISTANCE_METRES}m of the court to check in. You appear to be ${Math.round(distanceMetres)}m away.`,
      })
    }

    // Rate limiting: max 1 check-in per court per user per 15 minutes
    const fifteenMinutesAgo = DateTime.utc().minus({ minutes: 15 })
    const recentCheckIn = await CheckIn.query()
      .where('court_id', data.courtId)
      .where('user_id', user.id)
      .where('created_at', '>=', fifteenMinutesAgo.toSQL()!)
      .first()

    if (recentCheckIn) {
      return response.tooManyRequests({
        message: 'You can only check in once every 15 minutes at the same court.',
      })
    }

    // Ambassador check-ins carry a higher confidence weight
    const confidenceWeight = user.isAmbassador ? 1.5 : 1.0

    const checkIn = await CheckIn.create({
      courtId: data.courtId,
      courtGroupId: data.courtGroupId ?? null,
      userId: user.id,
      status: data.status,
      racketsWaiting: data.racketsWaiting ?? null,
      latitude: data.latitude,
      longitude: data.longitude,
      confidenceWeight,
    })

    return serialize(CheckInTransformer.transform(checkIn))
  }
}
