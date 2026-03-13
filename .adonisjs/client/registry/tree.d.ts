/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
  }
  courts: {
    courts: {
      index: typeof routes['courts.courts.index']
      nearby: typeof routes['courts.courts.nearby']
      showBySlug: typeof routes['courts.courts.show_by_slug']
      show: typeof routes['courts.courts.show']
    }
  }
  checkIns: {
    checkIns: {
      store: typeof routes['checkIns.check_ins.store']
    }
  }
  presence: {
    presences: {
      store: typeof routes['presence.presences.store']
      destroy: typeof routes['presence.presences.destroy']
    }
  }
}
