import Court from '#models/court'
import CourtStatusService from '#services/court_status_service'
import CourtTransformer from '#transformers/court_transformer'
import { nearbyQueryValidator } from '#validators/court'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CourtsController {
  /**
   * GET /api/courts
   * List all courts with their latest computed status.
   */
  async index({ serialize }: HttpContext) {
    const courts = await Court.query().preload('courtGroups').orderBy('name', 'asc')

    const results = await Promise.all(
      courts.map(async (court) => {
        const status = await CourtStatusService.computeStatus(court.id)
        return CourtTransformer.transformWithStatus(court, status)
      })
    )

    return serialize(results)
  }

  /**
   * GET /api/courts/nearby?lat=&lng=&radius=
   * Courts within radius metres (default 5 km) ordered by distance.
   * Uses a Haversine SQL formula — works with or without PostGIS.
   */
  async nearby({ request, serialize }: HttpContext) {
    const { lat, lng, radius = 5000 } = await request.validateUsing(nearbyQueryValidator)

    // Haversine formula in plain SQL (PostgreSQL).
    // Returns distance in metres; filters to the bounding box first for index use.
    const rows = await db.rawQuery<{ rows: { id: number; distance: number }[] }>(
      `
      SELECT id,
        6371000 * 2 * ASIN(SQRT(
          POWER(SIN(RADIANS((latitude  - ?) / 2)), 2) +
          COS(RADIANS(?)) * COS(RADIANS(latitude)) *
          POWER(SIN(RADIANS((longitude - ?) / 2)), 2)
        )) AS distance
      FROM courts
      WHERE latitude  BETWEEN ? - DEGREES(? / 6371000.0) AND ? + DEGREES(? / 6371000.0)
        AND longitude BETWEEN ? - DEGREES(? / (6371000.0 * COS(RADIANS(?)))) AND ? + DEGREES(? / (6371000.0 * COS(RADIANS(?))))
      HAVING 6371000 * 2 * ASIN(SQRT(
        POWER(SIN(RADIANS((latitude  - ?) / 2)), 2) +
        COS(RADIANS(?)) * COS(RADIANS(latitude)) *
        POWER(SIN(RADIANS((longitude - ?) / 2)), 2)
      )) <= ?
      ORDER BY distance
      `,
      [
        // ASIN args
        lat,
        lat,
        lng,
        // bounding box — lat band
        lat,
        radius,
        lat,
        radius,
        // bounding box — lng band
        lng,
        radius,
        lat,
        lng,
        radius,
        lat,
        // HAVING filter
        lat,
        lat,
        lng,
        radius,
      ]
    )

    const ids: number[] = rows.rows.map((r) => r.id)
    if (ids.length === 0) return serialize([])

    const courts = await Court.query().whereIn('id', ids).preload('courtGroups')

    const distanceMap = new Map(rows.rows.map((r) => [r.id, r.distance]))
    courts.sort((a, b) => (distanceMap.get(a.id) ?? 0) - (distanceMap.get(b.id) ?? 0))

    const results = await Promise.all(
      courts.map(async (court) => {
        const status = await CourtStatusService.computeStatus(court.id)
        return {
          ...CourtTransformer.transformWithStatus(court, status),
          distanceMetres: Math.round(distanceMap.get(court.id) ?? 0),
        }
      })
    )

    return serialize(results)
  }

  /**
   * GET /api/courts/:id
   * Single court with groups, recent check-ins, and confidence score.
   */
  async show({ params, serialize, response }: HttpContext) {
    const court = await Court.query()
      .where('id', params.id)
      .preload('courtGroups')
      .preload('checkIns', (q) => q.orderBy('created_at', 'desc').limit(5))
      .first()

    if (!court) {
      return response.notFound({ message: 'Court not found' })
    }

    const status = await CourtStatusService.computeStatus(court.id)
    return serialize(CourtTransformer.transformWithStatus(court, status))
  }

  /**
   * GET /api/courts/slug/:slug
   * Single court lookup by slug — used by the Next.js landing preview page.
   */
  async showBySlug({ params, serialize, response }: HttpContext) {
    const court = await Court.query()
      .where('slug', params.slug)
      .preload('courtGroups')
      .preload('checkIns', (q) => q.orderBy('created_at', 'desc').limit(5))
      .first()

    if (!court) {
      return response.notFound({ message: 'Court not found' })
    }

    const status = await CourtStatusService.computeStatus(court.id)
    return serialize(CourtTransformer.transformWithStatus(court, status))
  }
}
