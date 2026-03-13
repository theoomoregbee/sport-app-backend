import type Court from '#models/court'
import { BaseTransformer } from '@adonisjs/core/transformers'
import type { CourtStatus } from '#services/court_status_service'
import CourtGroupTransformer from '#transformers/court_group_transformer'
import CheckInTransformer from '#transformers/check_in_transformer'

export default class CourtTransformer extends BaseTransformer<Court> {
  constructor(
    resource: Court,
    private readonly computedStatus?: CourtStatus
  ) {
    super(resource)
  }

  /** Truncate a coordinate to 4 decimal places (~11 m precision). */
  private static truncateCoord(value: number | null | undefined): number | null {
    if (value == null) return null
    return Math.round(value * 10000) / 10000
  }

  toObject() {
    const base = this.pick(this.resource, [
      'id',
      'name',
      'slug',
      'address',
      'photoUrl',
      'totalCourtCount',
      'isPriority',
      'createdAt',
      'updatedAt',
    ])

    // Limit GPS precision to 4 decimal places to prevent exact location scraping
    const latitude = CourtTransformer.truncateCoord(this.resource.latitude)
    const longitude = CourtTransformer.truncateCoord(this.resource.longitude)

    const groups = CourtGroupTransformer.transform(this.whenLoaded(this.resource.courtGroups))

    const recentCheckIns = CheckInTransformer.transform(
      this.whenLoaded(this.resource.checkIns?.slice(0, 5))
    )

    return {
      ...base,
      latitude,
      longitude,
      courtGroups: groups,
      recentCheckIns,
      ...(this.computedStatus
        ? {
            status: this.computedStatus.status,
            confidence: this.computedStatus.confidence,
            lastUpdated: this.computedStatus.lastUpdated,
            lastUpdatedRelative: this.computedStatus.lastUpdatedRelative,
            checkInCount: this.computedStatus.checkInCount,
            racketsWaiting: this.computedStatus.racketsWaiting,
            activeUsersCount: this.computedStatus.activeUsersCount,
          }
        : {}),
    }
  }

  static transformWithStatus(court: Court, status: CourtStatus) {
    return new CourtTransformer(court, status).toObject()
  }
}
