import type CourtGroup from '#models/court_group'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class CourtGroupTransformer extends BaseTransformer<CourtGroup> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'courtId',
      'name',
      'courtCount',
      'sessionTimeMinutes',
      'notes',
      'createdAt',
    ])
  }
}
