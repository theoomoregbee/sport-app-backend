import vine from '@vinejs/vine'

export const createCheckInValidator = vine.create({
  courtId: vine.number().positive(),
  courtGroupId: vine.number().positive().optional(),
  status: vine.enum(['empty', 'moderate', 'packed'] as const),
  racketsWaiting: vine.number().min(0).max(20).optional(),
  latitude: vine.number().min(-90).max(90),
  longitude: vine.number().min(-180).max(180),
})
