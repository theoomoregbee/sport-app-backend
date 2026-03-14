import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'users.users.profile': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courts.courts.index': { paramsTuple?: []; params?: {} }
    'courts.courts.nearby': { paramsTuple?: []; params?: {} }
    'courts.courts.show_by_slug': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'courts.courts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'waitlist.waitlist_entries.store': { paramsTuple?: []; params?: {} }
    'checkIns.check_ins.store': { paramsTuple?: []; params?: {} }
    'presences.index': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
    'match_requests.index': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
    'matchRequests.match_requests.mine': { paramsTuple?: []; params?: {} }
    'matchRequests.match_requests.store': { paramsTuple?: []; params?: {} }
    'matchRequests.match_requests.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'matchRequests.match_requests.respond': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'presence.presences.store': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
    'presence.presences.destroy': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'users.users.profile': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courts.courts.index': { paramsTuple?: []; params?: {} }
    'courts.courts.nearby': { paramsTuple?: []; params?: {} }
    'courts.courts.show_by_slug': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'courts.courts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'presences.index': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
    'match_requests.index': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
    'matchRequests.match_requests.mine': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'users.users.profile': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'courts.courts.index': { paramsTuple?: []; params?: {} }
    'courts.courts.nearby': { paramsTuple?: []; params?: {} }
    'courts.courts.show_by_slug': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'courts.courts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'presences.index': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
    'match_requests.index': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
    'matchRequests.match_requests.mine': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'waitlist.waitlist_entries.store': { paramsTuple?: []; params?: {} }
    'checkIns.check_ins.store': { paramsTuple?: []; params?: {} }
    'matchRequests.match_requests.store': { paramsTuple?: []; params?: {} }
    'matchRequests.match_requests.respond': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'presence.presences.store': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
  }
  DELETE: {
    'matchRequests.match_requests.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'presence.presences.destroy': { paramsTuple: [ParamValue]; params: {'courtId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}