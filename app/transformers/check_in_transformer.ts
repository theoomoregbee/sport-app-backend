import type CheckIn from '#models/check_in'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class CheckInTransformer extends BaseTransformer<CheckIn> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'courtId',
      'courtGroupId',
      'userId',
      'status',
      'racketsWaiting',
      'createdAt',
    ])
  }
}
