import CheckIn, { type CheckInStatus } from '#models/check_in'
import Presence from '#models/presence'
import { DateTime } from 'luxon'

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'none'

export interface CourtStatus {
  status: CheckInStatus | 'unknown'
  confidence: ConfidenceLevel
  lastUpdated: DateTime | null
  lastUpdatedRelative: string | null
  checkInCount: number
  racketsWaiting: number | null
  activeUsersCount: number
}

const STATUS_VALUES: Record<CheckInStatus, number> = {
  empty: 1,
  moderate: 2,
  packed: 3,
}

export function timeDecayWeight(minutesAgo: number): number {
  if (minutesAgo <= 15) return 1.0
  if (minutesAgo <= 30) return 0.8
  if (minutesAgo <= 60) return 0.5
  return 0.2
}

export function relativeTime(dt: DateTime, now = DateTime.utc()): string {
  const diff = now.diff(dt, ['hours', 'minutes'])
  const hours = Math.floor(diff.hours)
  const minutes = Math.floor(diff.minutes)

  if (hours > 0) return `${hours}h ago`
  if (minutes < 1) return 'just now'
  return `${minutes}m ago`
}

type CheckInSnapshot = Pick<CheckIn, 'status' | 'confidenceWeight' | 'createdAt' | 'racketsWaiting'>

/**
 * Pure function: compute court status from an already-filtered list of check-ins.
 * Accepts `now` so tests can control the clock.
 */
export function computeStatusFromCheckIns(
  checkIns: CheckInSnapshot[],
  now = DateTime.utc()
): CourtStatus {
  if (checkIns.length === 0) {
    return {
      status: 'unknown',
      confidence: 'none',
      lastUpdated: null,
      lastUpdatedRelative: null,
      checkInCount: 0,
      racketsWaiting: null,
      activeUsersCount: 0,
    }
  }

  let totalWeight = 0
  let weightedSum = 0

  for (const checkIn of checkIns) {
    const minutesAgo = now.diff(checkIn.createdAt, 'minutes').minutes
    const weight = timeDecayWeight(minutesAgo) * checkIn.confidenceWeight
    weightedSum += STATUS_VALUES[checkIn.status] * weight
    totalWeight += weight
  }

  const avgStatus = weightedSum / totalWeight
  let status: CheckInStatus
  if (avgStatus < 1.5) status = 'empty'
  else if (avgStatus < 2.5) status = 'moderate'
  else status = 'packed'

  // Confidence: based on how many check-ins fall within recent windows
  const thirtyMinAgo = now.minus({ minutes: 30 })
  const sixtyMinAgo = now.minus({ minutes: 60 })

  const recentCount = checkIns.filter((c) => c.createdAt >= thirtyMinAgo).length
  const hourCount = checkIns.filter((c) => c.createdAt >= sixtyMinAgo).length

  let confidence: ConfidenceLevel
  if (recentCount >= 3) confidence = 'high'
  else if (hourCount >= 1) confidence = 'medium'
  else confidence = 'low'

  const lastUpdated = checkIns[0].createdAt

  // Surface the most recent reported rackets-waiting value
  const latestWithRackets = checkIns.find((c) => c.racketsWaiting !== null)
  const racketsWaiting = latestWithRackets?.racketsWaiting ?? null

  return {
    status,
    confidence,
    lastUpdated,
    lastUpdatedRelative: relativeTime(lastUpdated, now),
    checkInCount: checkIns.length,
    racketsWaiting,
    activeUsersCount: 0,
  }
}

export default class CourtStatusService {
  static async computeStatus(courtId: number): Promise<CourtStatus> {
    const now = DateTime.utc()
    const twoHoursAgo = now.minus({ hours: 2 })
    const thirtyMinutesAgo = now.minus({ minutes: 30 })

    const [checkIns, presenceRows] = await Promise.all([
      CheckIn.query()
        .where('court_id', courtId)
        .where('created_at', '>=', twoHoursAgo.toSQL()!)
        .orderBy('created_at', 'desc'),
      Presence.query()
        .where('court_id', courtId)
        .where('last_heartbeat_at', '>=', thirtyMinutesAgo.toSQL()!),
    ])

    const status = computeStatusFromCheckIns(checkIns)
    return { ...status, activeUsersCount: presenceRows.length }
  }
}
