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

  toObject() {
    const base = this.pick(this.resource, [
      'id',
      'name',
      'slug',
      'address',
      'latitude',
      'longitude',
      'photoUrl',
      'totalCourtCount',
      'isPriority',
      'createdAt',
      'updatedAt',
    ])

    const groups = CourtGroupTransformer.transform(this.whenLoaded(this.resource.courtGroups))

    const recentCheckIns = CheckInTransformer.transform(
      this.whenLoaded(this.resource.checkIns?.slice(0, 5))
    )

    return {
      ...base,
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
