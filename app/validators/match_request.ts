import vine from '@vinejs/vine'

export const createMatchRequestValidator = vine.compile(
  vine.object({
    courtId: vine.number().positive(),
    skillLevels: vine
      .array(vine.enum(['beginner', 'intermediate', 'advanced', 'competitive'] as const))
      .minLength(1),
    scheduledFor: vine.string().optional(),
    message: vine.string().trim().maxLength(200).nullable().optional(),
  })
)
