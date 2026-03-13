import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'

/** Valid keys derived from env at startup — no per-request env lookups. */
const VALID_KEYS: ReadonlySet<string> = (() => {
  const keys = [env.get('API_KEY_MOBILE'), env.get('API_KEY_LANDING')].filter((k): k is string =>
    Boolean(k)
  )
  return new Set(keys)
})()

/** Whether key enforcement is active (at least one key is configured). */
const ENFORCEMENT_ACTIVE = VALID_KEYS.size > 0

if (!ENFORCEMENT_ACTIVE && env.get('NODE_ENV') === 'production') {
  throw new Error(
    'API keys are not configured. Set API_KEY_MOBILE and/or API_KEY_LANDING before deploying to production.'
  )
}

/**
 * Simple deny-list cache — refreshed every 5 minutes.
 * Keeps the happy path fast without a DB round-trip per request.
 */
let denyListCache: Array<{ type: string; value: string; expires_at: Date | null }> = []
let denyListFetchedAt = 0

async function isDenied(ip: string, apiKey: string | null): Promise<boolean> {
  const now = Date.now()
  if (now - denyListFetchedAt > 5 * 60 * 1000) {
    denyListCache = await db
      .from('deny_list')
      .whereNull('expires_at')
      .orWhere('expires_at', '>', new Date())
      .select('type', 'value', 'expires_at')
    denyListFetchedAt = now
  }

  return denyListCache.some(
    (entry) =>
      (entry.type === 'ip' && entry.value === ip) ||
      (entry.type === 'api_key' && apiKey && entry.value === apiKey)
  )
}

export default class ApiKeyMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const ip = request.ip()
    const apiKey = request.header('X-API-Key') ?? null

    // Block denied IPs and keys regardless of enforcement state
    if (await isDenied(ip, apiKey)) {
      return response.forbidden({ error: 'Access denied.' })
    }

    // If no keys are configured (local dev), allow all
    if (!ENFORCEMENT_ACTIVE) {
      return next()
    }

    if (!apiKey || !VALID_KEYS.has(apiKey)) {
      return response.unauthorized({ error: 'Missing or invalid API key.' })
    }

    return next()
  }
}
