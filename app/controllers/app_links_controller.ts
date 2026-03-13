import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class AppLinksController {
  /**
   * GET /.well-known/apple-app-site-association
   * Tells iOS which URL paths should open in the app (Universal Links).
   */
  apple({ response }: HttpContext) {
    const bundleId = env.get('APP_IOS_BUNDLE_ID')
    const teamId = env.get('APP_IOS_TEAM_ID')

    if (!bundleId || !teamId) {
      return response.notFound({ message: 'iOS Universal Links not configured' })
    }

    const payload = {
      applinks: {
        apps: [],
        details: [
          {
            appID: `${teamId}.${bundleId}`,
            paths: ['/courts/*'],
          },
        ],
      },
    }

    response.header('Content-Type', 'application/json')
    return response.send(payload)
  }

  /**
   * GET /.well-known/assetlinks.json
   * Tells Android which URL paths should open in the app (App Links).
   */
  android({ response }: HttpContext) {
    const packageName = env.get('APP_ANDROID_PACKAGE')
    const sha256Cert = env.get('APP_ANDROID_SHA256_CERT')

    if (!packageName || !sha256Cert) {
      return response.notFound({ message: 'Android App Links not configured' })
    }

    const payload = [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: packageName,
          sha256_cert_fingerprints: [sha256Cert],
        },
      },
    ]

    response.header('Content-Type', 'application/json')
    return response.send(payload)
  }
}
