import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Court from '#models/court'
import CourtGroup from '#models/court_group'

/**
 * Seeds the 7 priority courts with full detail:
 * - Accurate GPS coordinates
 * - Court groups with session rules
 * - Total court counts
 *
 * Safe to re-run — uses updateOrCreate on slug.
 * Court groups are deleted and recreated on each run to keep them in sync.
 */

type CourtGroupSeed = {
  name: string
  courtCount: number
  sessionTimeMinutes: number | null
  notes: string | null
}

type CourtSeed = {
  name: string
  slug: string
  address: string
  latitude: number
  longitude: number
  totalCourtCount: number
  groups: CourtGroupSeed[]
}

const PRIORITY_COURTS: CourtSeed[] = [
  {
    name: 'Riverdale Park East',
    slug: 'riverdale-park-east',
    address: '550 Broadview Ave, Toronto, ON',
    latitude: 43.6701,
    longitude: -79.354,
    totalCourtCount: 8,
    groups: [
      {
        name: 'North Courts (1–4)',
        courtCount: 4,
        sessionTimeMinutes: 30,
        notes: '30 min limit when others waiting. Premium clay-surface area.',
      },
      {
        name: 'South Courts (5–8)',
        courtCount: 4,
        sessionTimeMinutes: 30,
        notes: '30 min limit when others waiting.',
      },
    ],
  },
  {
    name: 'Ramsden Park',
    slug: 'ramsden-park',
    address: '1090 Yonge St, Toronto, ON',
    latitude: 43.6791,
    longitude: -79.3929,
    totalCourtCount: 8,
    groups: [
      {
        name: 'All Courts',
        courtCount: 8,
        sessionTimeMinutes: 30,
        notes:
          '30 min limit when others waiting. Very popular — expect waits on evenings and weekends.',
      },
    ],
  },
  {
    name: 'High Park',
    slug: 'high-park',
    address: '1873 Bloor St W, Toronto, ON',
    latitude: 43.6467,
    longitude: -79.4637,
    totalCourtCount: 7,
    groups: [
      {
        name: 'Main Courts',
        courtCount: 7,
        sessionTimeMinutes: 45,
        notes:
          '45 min limit when others waiting. Near the tennis house — check in at the booth for court assignment in peak season.',
      },
    ],
  },
  {
    name: 'Kew Gardens',
    slug: 'kew-gardens',
    address: '2075 Queen St E, Toronto, ON',
    latitude: 43.6673,
    longitude: -79.3015,
    totalCourtCount: 6,
    groups: [
      {
        name: 'All Courts',
        courtCount: 6,
        sessionTimeMinutes: 30,
        notes:
          '30 min limit when others waiting. Popular with the Beach community on summer evenings.',
      },
    ],
  },
  {
    name: 'Cedarvale Park',
    slug: 'cedarvale-park',
    address: 'Heath St W & Ava Rd, Toronto, ON',
    latitude: 43.7099,
    longitude: -79.4174,
    totalCourtCount: 4,
    groups: [
      {
        name: 'All Courts',
        courtCount: 4,
        sessionTimeMinutes: 30,
        notes: '30 min limit when others waiting.',
      },
    ],
  },
  {
    name: 'Christie Pits',
    slug: 'christie-pits',
    address: '750 Bloor St W, Toronto, ON',
    latitude: 43.6625,
    longitude: -79.4213,
    totalCourtCount: 4,
    groups: [
      {
        name: 'East Courts (1–2)',
        courtCount: 2,
        sessionTimeMinutes: 30,
        notes: '30 min limit when others waiting.',
      },
      {
        name: 'West Courts (3–4)',
        courtCount: 2,
        sessionTimeMinutes: 30,
        notes: '30 min limit when others waiting.',
      },
    ],
  },
  {
    name: 'Trinity Bellwoods',
    slug: 'trinity-bellwoods',
    address: '790 Queen St W, Toronto, ON',
    latitude: 43.6474,
    longitude: -79.4205,
    totalCourtCount: 6,
    groups: [
      {
        name: 'North Courts (1–2)',
        courtCount: 2,
        sessionTimeMinutes: 30,
        notes: 'Near Bloor entrance.',
      },
      {
        name: 'Centre Courts (3–4)',
        courtCount: 2,
        sessionTimeMinutes: 30,
        notes: 'Most popular group — highest wait times.',
      },
      {
        name: 'South Courts (5–6)',
        courtCount: 2,
        sessionTimeMinutes: 30,
        notes: 'Near Queen St entrance.',
      },
    ],
  },
]

export default class PriorityCourtsSeeder extends BaseSeeder {
  async run() {
    for (const data of PRIORITY_COURTS) {
      const { groups, ...courtData } = data

      const court = await Court.updateOrCreate(
        { slug: courtData.slug },
        { ...courtData, isPriority: true }
      )

      // Delete and recreate groups so changes in this file are always reflected
      await CourtGroup.query().where('court_id', court.id).delete()
      await CourtGroup.createMany(groups.map((g) => ({ ...g, courtId: court.id })))

      console.log(`  ✓ ${court.name} (${groups.length} group${groups.length > 1 ? 's' : ''})`)
    }

    console.log(`\nSeeded ${PRIORITY_COURTS.length} priority courts.`)
  }
}
