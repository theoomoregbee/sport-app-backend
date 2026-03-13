import vine from '@vinejs/vine'

export const createWaitlistEntryValidator = vine.create({
  email: vine.string().email().maxLength(254).unique({
    table: 'waitlist_entries',
    column: 'email',
  }),
  referrer: vine.string().trim().maxLength(120).optional(),
})
