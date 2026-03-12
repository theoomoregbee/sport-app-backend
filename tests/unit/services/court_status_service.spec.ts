import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import {
  timeDecayWeight,
  computeStatusFromCheckIns,
  relativeTime,
} from '#services/court_status_service'
import type { CheckInStatus } from '#models/check_in'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NOW = DateTime.fromISO('2024-06-01T12:00:00.000Z', { zone: 'utc' }) as DateTime

/** Past time relative to NOW. Use so Luxon's DateTime<true> is satisfied. */
function past(opts: { seconds?: number; minutes?: number; hours?: number }): DateTime {
  return NOW.minus(opts) as DateTime
}

type CheckInSnapshot = {
  status: CheckInStatus
  confidenceWeight: number
  createdAt: DateTime
  racketsWaiting: number | null
}

/** Build a minimal check-in snapshot at `minutesAgo` minutes before NOW. */
function makeCheckIn(
  status: CheckInStatus,
  minutesAgo: number,
  opts: { confidenceWeight?: number; racketsWaiting?: number | null } = {}
): CheckInSnapshot {
  return {
    status,
    confidenceWeight: opts.confidenceWeight ?? 1.0,
    createdAt: past({ minutes: minutesAgo }),
    racketsWaiting: opts.racketsWaiting ?? null,
  }
}

// ---------------------------------------------------------------------------
// timeDecayWeight
// ---------------------------------------------------------------------------

test.group('timeDecayWeight', () => {
  test('0 minutes ago → 1.0', ({ assert }) => {
    assert.equal(timeDecayWeight(0), 1.0)
  })

  test('15 minutes ago → 1.0 (inclusive boundary)', ({ assert }) => {
    assert.equal(timeDecayWeight(15), 1.0)
  })

  test('16 minutes ago → 0.8', ({ assert }) => {
    assert.equal(timeDecayWeight(16), 0.8)
  })

  test('30 minutes ago → 0.8 (inclusive boundary)', ({ assert }) => {
    assert.equal(timeDecayWeight(30), 0.8)
  })

  test('31 minutes ago → 0.5', ({ assert }) => {
    assert.equal(timeDecayWeight(31), 0.5)
  })

  test('60 minutes ago → 0.5 (inclusive boundary)', ({ assert }) => {
    assert.equal(timeDecayWeight(60), 0.5)
  })

  test('61 minutes ago → 0.2', ({ assert }) => {
    assert.equal(timeDecayWeight(61), 0.2)
  })

  test('120 minutes ago → 0.2', ({ assert }) => {
    assert.equal(timeDecayWeight(120), 0.2)
  })
})

// ---------------------------------------------------------------------------
// relativeTime
// ---------------------------------------------------------------------------

test.group('relativeTime', () => {
  test('just now for < 1 minute', ({ assert }) => {
    assert.equal(relativeTime(past({ seconds: 30 }), NOW), 'just now')
  })

  test('X minutes ago', ({ assert }) => {
    assert.equal(relativeTime(past({ minutes: 5 }), NOW), '5m ago')
  })

  test('X hours ago', ({ assert }) => {
    assert.equal(relativeTime(past({ hours: 2 }), NOW), '2h ago')
  })
})

// ---------------------------------------------------------------------------
// computeStatusFromCheckIns — no data
// ---------------------------------------------------------------------------

test.group('computeStatusFromCheckIns — no check-ins', () => {
  test('returns unknown status with none confidence', ({ assert }) => {
    const result = computeStatusFromCheckIns([], NOW)

    assert.equal(result.status, 'unknown')
    assert.equal(result.confidence, 'none')
    assert.isNull(result.lastUpdated)
    assert.isNull(result.lastUpdatedRelative)
    assert.equal(result.checkInCount, 0)
    assert.isNull(result.racketsWaiting)
  })
})

// ---------------------------------------------------------------------------
// computeStatusFromCheckIns — status (weighted average)
// ---------------------------------------------------------------------------

test.group('computeStatusFromCheckIns — status computation', () => {
  test('single empty check-in → empty', ({ assert }) => {
    const result = computeStatusFromCheckIns([makeCheckIn('empty', 5)], NOW)
    assert.equal(result.status, 'empty')
  })

  test('single packed check-in → packed', ({ assert }) => {
    const result = computeStatusFromCheckIns([makeCheckIn('packed', 5)], NOW)
    assert.equal(result.status, 'packed')
  })

  test('two equal-weight conflicting check-ins → moderate (avg = 2.0)', ({ assert }) => {
    // empty=1, packed=3 → avg=2.0 → moderate
    const result = computeStatusFromCheckIns(
      [makeCheckIn('empty', 5), makeCheckIn('packed', 5)],
      NOW
    )
    assert.equal(result.status, 'moderate')
  })

  test('older packed check-in is outweighed by newer empty check-ins', ({ assert }) => {
    // Two fresh empty (weight 1.0 each) vs one old packed (weight 0.2)
    // weightedSum = 1*1 + 1*1 + 3*0.2 = 2.6, totalWeight = 2.2, avg ≈ 1.18 → empty
    const result = computeStatusFromCheckIns(
      [makeCheckIn('empty', 5), makeCheckIn('empty', 10), makeCheckIn('packed', 90)],
      NOW
    )
    assert.equal(result.status, 'empty')
  })

  test('ambassador check-in (1.5x weight) shifts result toward packed', ({ assert }) => {
    // regular empty (weight 1.0) vs ambassador packed (weight 1.5)
    // weightedSum = 1*1.0 + 3*1.5 = 5.5, totalWeight = 2.5, avg = 2.2 → moderate
    const result = computeStatusFromCheckIns(
      [makeCheckIn('empty', 5), makeCheckIn('packed', 5, { confidenceWeight: 1.5 })],
      NOW
    )
    assert.equal(result.status, 'moderate')
  })
})

// ---------------------------------------------------------------------------
// computeStatusFromCheckIns — confidence levels
// ---------------------------------------------------------------------------

test.group('computeStatusFromCheckIns — confidence', () => {
  test('3+ check-ins in last 30 min → high', ({ assert }) => {
    const result = computeStatusFromCheckIns(
      [makeCheckIn('empty', 5), makeCheckIn('empty', 15), makeCheckIn('empty', 25)],
      NOW
    )
    assert.equal(result.confidence, 'high')
  })

  test('exactly 3 check-ins, all at 30 min (boundary) → high', ({ assert }) => {
    const result = computeStatusFromCheckIns(
      [makeCheckIn('empty', 30), makeCheckIn('empty', 30), makeCheckIn('empty', 30)],
      NOW
    )
    assert.equal(result.confidence, 'high')
  })

  test('2 check-ins in last 60 min → medium', ({ assert }) => {
    const result = computeStatusFromCheckIns(
      [makeCheckIn('empty', 45), makeCheckIn('empty', 55)],
      NOW
    )
    assert.equal(result.confidence, 'medium')
  })

  test('1 check-in in last 60 min → medium', ({ assert }) => {
    const result = computeStatusFromCheckIns([makeCheckIn('empty', 45)], NOW)
    assert.equal(result.confidence, 'medium')
  })

  test('check-ins only between 60–120 min ago → low', ({ assert }) => {
    const result = computeStatusFromCheckIns(
      [makeCheckIn('empty', 70), makeCheckIn('empty', 110)],
      NOW
    )
    assert.equal(result.confidence, 'low')
  })

  test('single check-in 119 min ago → low', ({ assert }) => {
    const result = computeStatusFromCheckIns([makeCheckIn('packed', 119)], NOW)
    assert.equal(result.confidence, 'low')
  })
})

// ---------------------------------------------------------------------------
// computeStatusFromCheckIns — racketsWaiting
// ---------------------------------------------------------------------------

test.group('computeStatusFromCheckIns — racketsWaiting', () => {
  test('returns null when no check-in reports rackets', ({ assert }) => {
    const result = computeStatusFromCheckIns([makeCheckIn('moderate', 5)], NOW)
    assert.isNull(result.racketsWaiting)
  })

  test('returns value from most recent check-in that reported it', ({ assert }) => {
    // checkIns are sorted newest-first (as the DB query does)
    const result = computeStatusFromCheckIns(
      [
        makeCheckIn('packed', 5, { racketsWaiting: 4 }),
        makeCheckIn('packed', 20, { racketsWaiting: 7 }),
      ],
      NOW
    )
    assert.equal(result.racketsWaiting, 4)
  })

  test('falls back to older check-in when newest has no rackets value', ({ assert }) => {
    const result = computeStatusFromCheckIns(
      [
        makeCheckIn('packed', 5, { racketsWaiting: null }),
        makeCheckIn('packed', 20, { racketsWaiting: 3 }),
      ],
      NOW
    )
    assert.equal(result.racketsWaiting, 3)
  })
})

// ---------------------------------------------------------------------------
// computeStatusFromCheckIns — checkInCount and lastUpdated
// ---------------------------------------------------------------------------

test.group('computeStatusFromCheckIns — metadata', () => {
  test('checkInCount matches number of check-ins provided', ({ assert }) => {
    const result = computeStatusFromCheckIns(
      [makeCheckIn('empty', 5), makeCheckIn('empty', 30), makeCheckIn('empty', 90)],
      NOW
    )
    assert.equal(result.checkInCount, 3)
  })

  test('lastUpdated is the most recent check-in timestamp', ({ assert }) => {
    const mostRecent = makeCheckIn('empty', 5)
    const older = makeCheckIn('empty', 30)
    const result = computeStatusFromCheckIns([mostRecent, older], NOW)
    assert.deepEqual(result.lastUpdated, mostRecent.createdAt)
  })
})
