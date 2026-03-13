/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_token.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_token.store']['types'],
  },
  'auth.access_token.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.access_token.destroy']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.profile.update': {
    methods: ["PUT"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.update']['types'],
  },
  'users.users.profile': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:id/profile',
    tokens: [{"old":"/api/v1/users/:id/profile","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id/profile","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id/profile","type":1,"val":"id","end":""},{"old":"/api/v1/users/:id/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['users.users.profile']['types'],
  },
  'courts.courts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courts',
    tokens: [{"old":"/api/v1/courts","type":0,"val":"api","end":""},{"old":"/api/v1/courts","type":0,"val":"v1","end":""},{"old":"/api/v1/courts","type":0,"val":"courts","end":""}],
    types: placeholder as Registry['courts.courts.index']['types'],
  },
  'courts.courts.nearby': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courts/nearby',
    tokens: [{"old":"/api/v1/courts/nearby","type":0,"val":"api","end":""},{"old":"/api/v1/courts/nearby","type":0,"val":"v1","end":""},{"old":"/api/v1/courts/nearby","type":0,"val":"courts","end":""},{"old":"/api/v1/courts/nearby","type":0,"val":"nearby","end":""}],
    types: placeholder as Registry['courts.courts.nearby']['types'],
  },
  'courts.courts.show_by_slug': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courts/slug/:slug',
    tokens: [{"old":"/api/v1/courts/slug/:slug","type":0,"val":"api","end":""},{"old":"/api/v1/courts/slug/:slug","type":0,"val":"v1","end":""},{"old":"/api/v1/courts/slug/:slug","type":0,"val":"courts","end":""},{"old":"/api/v1/courts/slug/:slug","type":0,"val":"slug","end":""},{"old":"/api/v1/courts/slug/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['courts.courts.show_by_slug']['types'],
  },
  'courts.courts.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/courts/:id',
    tokens: [{"old":"/api/v1/courts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/courts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/courts/:id","type":0,"val":"courts","end":""},{"old":"/api/v1/courts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['courts.courts.show']['types'],
  },
  'waitlist.waitlist_entries.store': {
    methods: ["POST"],
    pattern: '/api/v1/waitlist',
    tokens: [{"old":"/api/v1/waitlist","type":0,"val":"api","end":""},{"old":"/api/v1/waitlist","type":0,"val":"v1","end":""},{"old":"/api/v1/waitlist","type":0,"val":"waitlist","end":""}],
    types: placeholder as Registry['waitlist.waitlist_entries.store']['types'],
  },
  'checkIns.check_ins.store': {
    methods: ["POST"],
    pattern: '/api/v1/check-ins',
    tokens: [{"old":"/api/v1/check-ins","type":0,"val":"api","end":""},{"old":"/api/v1/check-ins","type":0,"val":"v1","end":""},{"old":"/api/v1/check-ins","type":0,"val":"check-ins","end":""}],
    types: placeholder as Registry['checkIns.check_ins.store']['types'],
  },
  'presence.presences.store': {
    methods: ["PUT"],
    pattern: '/api/v1/presence/:courtId',
    tokens: [{"old":"/api/v1/presence/:courtId","type":0,"val":"api","end":""},{"old":"/api/v1/presence/:courtId","type":0,"val":"v1","end":""},{"old":"/api/v1/presence/:courtId","type":0,"val":"presence","end":""},{"old":"/api/v1/presence/:courtId","type":1,"val":"courtId","end":""}],
    types: placeholder as Registry['presence.presences.store']['types'],
  },
  'presence.presences.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/presence/:courtId',
    tokens: [{"old":"/api/v1/presence/:courtId","type":0,"val":"api","end":""},{"old":"/api/v1/presence/:courtId","type":0,"val":"v1","end":""},{"old":"/api/v1/presence/:courtId","type":0,"val":"presence","end":""},{"old":"/api/v1/presence/:courtId","type":1,"val":"courtId","end":""}],
    types: placeholder as Registry['presence.presences.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
