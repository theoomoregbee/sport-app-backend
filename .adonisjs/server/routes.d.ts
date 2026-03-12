import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'courts.courts.index': { paramsTuple?: []; params?: {} }
    'courts.courts.nearby': { paramsTuple?: []; params?: {} }
    'courts.courts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'checkIns.check_ins.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'courts.courts.index': { paramsTuple?: []; params?: {} }
    'courts.courts.nearby': { paramsTuple?: []; params?: {} }
    'courts.courts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'courts.courts.index': { paramsTuple?: []; params?: {} }
    'courts.courts.nearby': { paramsTuple?: []; params?: {} }
    'courts.courts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'checkIns.check_ins.store': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}