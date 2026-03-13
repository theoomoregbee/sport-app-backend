/*
|--------------------------------------------------------------------------
| HTTP rate limiters
|--------------------------------------------------------------------------
|
| Throttle middleware definitions. Apply these to individual routes or groups.
| Keys include the client IP so limits are per-caller, not global.
|
*/

import limiter from '@adonisjs/limiter/services/main'

/** Courts list — tight cap to prevent bulk extraction */
export const courtsListThrottle = limiter.define('courts:list', (ctx) => {
  return limiter.allowRequests(10).every('1 minute').usingKey(`list:${ctx.request.ip()}`)
})

/** Single court detail */
export const courtDetailThrottle = limiter.define('courts:detail', (ctx) => {
  return limiter.allowRequests(30).every('1 minute').usingKey(`detail:${ctx.request.ip()}`)
})

/** Authenticated requests — higher ceiling */
export const authedThrottle = limiter.define('authed', (ctx) => {
  return limiter.allowRequests(200).every('1 minute').usingKey(`authed:${ctx.request.ip()}`)
})

/** Global fallback — all other /api/v1 routes */
export const globalThrottle = limiter.define('global', (ctx) => {
  return limiter.allowRequests(100).every('1 minute').usingKey(`global:${ctx.request.ip()}`)
})
