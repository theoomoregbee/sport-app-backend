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

    const groups =
      this.resource.courtGroups?.map((g) => CourtGroupTransformer.transform(g)) ?? []

    const recentCheckIns =
      this.resource.checkIns?.slice(0, 5).map((c) => CheckInTransformer.transform(c)) ?? []

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
          }
        : {}),
    }
  }

  static transformWithStatus(court: Court, status: CourtStatus) {
    return new CourtTransformer(court, status).toObject()
  }
}
