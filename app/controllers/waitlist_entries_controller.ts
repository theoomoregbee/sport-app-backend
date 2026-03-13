import WaitlistEntry from '#models/waitlist_entry'
import { createWaitlistEntryValidator } from '#validators/waitlist'
import type { HttpContext } from '@adonisjs/core/http'

export default class WaitlistEntriesController {
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createWaitlistEntryValidator)

    const entry = await WaitlistEntry.create({
      email: payload.email.trim().toLowerCase(),
      source: 'landing_page',
      referrer: payload.referrer?.trim() || null,
    })

    return response.created({
      message: "You're on the list! We'll let you know when we launch.",
      id: entry.id,
    })
  }
}
