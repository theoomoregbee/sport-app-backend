/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import {
  courtsListThrottle,
  courtDetailThrottle,
  authedThrottle,
  globalThrottle,
} from '#start/limiter'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')
      .use(globalThrottle)

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
      .use(authedThrottle)

    // Courts — public read, per-endpoint throttle
    router
      .group(() => {
        router.get('/', [controllers.Courts, 'index']).use(courtsListThrottle)
        router.get('/nearby', [controllers.Courts, 'nearby']).use(courtDetailThrottle)
        router.get('/slug/:slug', [controllers.Courts, 'showBySlug']).use(courtDetailThrottle)
        router.get('/:id', [controllers.Courts, 'show']).use(courtDetailThrottle)
      })
      .prefix('courts')
      .as('courts')

    router
      .group(() => {
        router.post('/', [controllers.WaitlistEntries, 'store'])
      })
      .prefix('waitlist')
      .as('waitlist')
      .use(globalThrottle)

    // Check-ins — requires auth
    router
      .group(() => {
        router.post('/', [controllers.CheckIns, 'store'])
      })
      .prefix('check-ins')
      .as('checkIns')
      .use(middleware.auth())
      .use(authedThrottle)

    // Presence (passive user count) — requires auth
    router
      .group(() => {
        router.put('/:courtId', [controllers.Presences, 'store'])
        router.delete('/:courtId', [controllers.Presences, 'destroy'])
      })
      .prefix('presence')
      .as('presence')
      .use(middleware.auth())
      .use(authedThrottle)
  })
  .prefix('/api/v1')
  .use(middleware.apiKey())
