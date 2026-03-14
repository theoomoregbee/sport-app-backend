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
        router.put('/profile', [controllers.Profile, 'update'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
      .use(authedThrottle)

    // Public user profiles
    router
      .group(() => {
        router.get('/:id/profile', [controllers.Users, 'profile'])
      })
      .prefix('users')
      .as('users')
      .use(courtDetailThrottle)

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

    // Presence feed — public read
    router
      .get('/presence/:courtId', [controllers.Presences, 'index'])
      .use(courtDetailThrottle)

    // Match requests per court — public read
    router
      .get('/courts/:courtId/match-requests', [controllers.MatchRequests, 'index'])
      .use(courtDetailThrottle)

    // Match requests — requires auth
    router
      .group(() => {
        router.get('/mine', [controllers.MatchRequests, 'mine'])
        router.post('/', [controllers.MatchRequests, 'store'])
        router.delete('/:id', [controllers.MatchRequests, 'destroy'])
        router.post('/:id/respond', [controllers.MatchRequests, 'respond'])
      })
      .prefix('match-requests')
      .as('matchRequests')
      .use(middleware.auth())
      .use(authedThrottle)

    // Presence mutations — requires auth
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
