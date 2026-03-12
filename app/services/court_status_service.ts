import CheckIn, { type CheckInStatus } from '#models/check_in'
import { DateTime } from 'luxon'

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'none'

export interface CourtStatus {
  status: CheckInStatus | 'unknown'
  confidence: ConfidenceLevel
  lastUpdated: DateTime | null
  lastUpdatedRelative: string | null
  checkInCount: number
}

const STATUS_VALUES: Record<CheckInStatus, number> = {
  empty: 1,
  moderate: 2,
  packed: 3,
}

function timeDecayWeight(minutesAgo: number): number {
  if (minutesAgo <= 15) return 1.0
  if (minutesAgo <= 30) return 0.8
  if (minutesAgo <= 60) return 0.5
  return 0.2
}

function relativeTime(dt: DateTime): string {
  const diff = DateTime.utc().diff(dt, ['hours', 'minutes'])
  const hours = Math.floor(diff.hours)
  const minutes = Math.floor(diff.minutes)

  if (hours > 0) return `${hours}h ago`
  if (minutes < 1) return 'just now'
  return `${minutes}m ago`
}

export default class CourtStatusService {
  static async computeStatus(courtId: number): Promise<CourtStatus> {
    const twoHoursAgo = DateTime.utc().minus({ hours: 2 })

    const checkIns = await CheckIn.query()
      .where('court_id', courtId)
      .where('created_at', '>=', twoHoursAgo.toSQL()!)
      .orderBy('created_at', 'desc')

    if (checkIns.length === 0) {
      return {
        status: 'unknown',
        confidence: 'none',
        lastUpdated: null,
        lastUpdatedRelative: null,
        checkInCount: 0,
      }
    }

    const now = DateTime.utc()
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

    // Confidence based on recency and count
    const thirtyMinAgo = now.minus({ minutes: 30 })
    const sixtyMinAgo = now.minus({ minutes: 60 })

    const recentCount = checkIns.filter((c) => c.createdAt >= thirtyMinAgo).length
    const mediumCount = checkIns.filter((c) => c.createdAt >= sixtyMinAgo).length

    let confidence: ConfidenceLevel
    if (recentCount >= 3) confidence = 'high'
    else if (mediumCount >= 1) confidence = 'medium'
    else confidence = 'low'

    const lastUpdated = checkIns[0].createdAt

    return {
      status,
      confidence,
      lastUpdated,
      lastUpdatedRelative: relativeTime(lastUpdated),
      checkInCount: checkIns.length,
    }
  }
}
