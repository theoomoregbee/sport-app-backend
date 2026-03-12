import vine from '@vinejs/vine'

export const nearbyQueryValidator = vine.create({
  lat: vine.number().min(-90).max(90),
  lng: vine.number().min(-180).max(180),
  radius: vine.number().positive().max(50_000).optional(),
})
