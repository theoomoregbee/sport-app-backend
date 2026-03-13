import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { defineConfig } from '@adonisjs/cors'

/**
 * In production the allowlist is built from APP_URL.
 * localhost variants are always included so local dev works without extra config.
 */
const ALLOWED_ORIGINS = (() => {
  const base = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
  ]
  if (!app.inDev) {
    const appUrl = env.get('APP_URL')
    if (appUrl) base.push(appUrl.replace(/\/$/, ''))
  }
  return base
})()

const corsConfig = defineConfig({
  enabled: true,

  /**
   * In development allow all origins (simplifies local dev across ports).
   * In production restrict to the landing domain and explicit localhost entries.
   */
  origin: app.inDev ? true : ALLOWED_ORIGINS,

  /**
   * HTTP methods accepted for cross-origin requests.
   */
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],

  /**
   * Reflect request headers by default. Use a string array to restrict
   * allowed headers.
   */
  headers: true,

  /**
   * Response headers exposed to the browser.
   */
  exposeHeaders: [],

  /**
   * Allow cookies/authorization headers on cross-origin requests.
   */
  credentials: true,

  /**
   * Cache CORS preflight response for N seconds.
   */
  maxAge: 90,
})

export default corsConfig
