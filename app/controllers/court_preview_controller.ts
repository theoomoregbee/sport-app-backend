import Court from '#models/court'
import CourtStatusService from '#services/court_status_service'
import { renderCourtPreview } from '#views/court_preview'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class CourtPreviewController {
  async show({ params, response }: HttpContext) {
    const court = await Court.findBy('slug', params.slug)
    if (!court) {
      return response.notFound('Court not found')
    }

    const status = await CourtStatusService.computeStatus(court.id)

    const html = renderCourtPreview({
      court,
      status,
      appUrl: env.get('APP_URL'),
      appScheme: env.get('APP_SCHEME', 'courtcheck'),
      iosBundleId: env.get('APP_IOS_BUNDLE_ID'),
      iosStoreUrl: env.get('APP_IOS_STORE_URL'),
      androidStoreUrl: env.get('APP_ANDROID_STORE_URL'),
    })

    response.header('Content-Type', 'text/html; charset=utf-8')
    return response.send(html)
  }
}
