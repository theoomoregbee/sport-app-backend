/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
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

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    // Courts — public read access
    router
      .group(() => {
        router.get('/', [controllers.Courts, 'index'])
        router.get('/nearby', [controllers.Courts, 'nearby'])
        router.get('/:id', [controllers.Courts, 'show'])
      })
      .prefix('courts')
      .as('courts')

    // Check-ins — requires auth
    router
      .group(() => {
        router.post('/', [controllers.CheckIns, 'store'])
      })
      .prefix('check-ins')
      .as('checkIns')
      .use(middleware.auth())

    // Presence (passive user count) — requires auth
    router
      .group(() => {
        router.put('/:courtId', [controllers.Presences, 'store'])
        router.delete('/:courtId', [controllers.Presences, 'destroy'])
      })
      .prefix('presence')
      .as('presence')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
