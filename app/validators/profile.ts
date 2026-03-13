import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(1).maxLength(100).optional(),
    bio: vine.string().trim().maxLength(300).nullable().optional(),
    skillLevel: vine
      .enum(['beginner', 'intermediate', 'advanced', 'competitive'] as const)
      .nullable()
      .optional(),
    playStyle: vine
      .array(vine.enum(['singles', 'doubles', 'rally', 'lessons'] as const))
      .nullable()
      .optional(),
    preferredTimes: vine
      .array(vine.enum(['weekday_mornings', 'weekday_evenings', 'weekends'] as const))
      .nullable()
      .optional(),
    homeCourtIds: vine.array(vine.string()).nullable().optional(),
    avatarUrl: vine.string().url().nullable().optional(),
    hideName: vine.boolean().optional(),
  })
)
