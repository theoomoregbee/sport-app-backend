import { BaseSchema } from '@adonisjs/lucid/schema'
import db from '@adonisjs/lucid/services/db'

/**
 * Adds a PostGIS geography column to the courts table.
 *
 * If PostGIS is not installed this migration completes silently — the app
 * falls back to a Haversine SQL formula for nearby queries.
 *
 * To enable PostGIS later:
 *   - Supabase / managed Postgres: enable via the database extensions UI
 *   - Self-hosted: `apt install postgresql-<ver>-postgis-3`
 *   Then roll back and re-run this migration.
 *
 * disableTransactions is set to true so a failed extension install does not
 * leave the connection in an aborted-transaction state.
 */
export default class extends BaseSchema {
  static disableTransactions = true
  protected tableName = 'courts'

  async up() {
    // Use db.rawQuery() (executes immediately) so try/catch actually catches
    // the database error, rather than this.schema.raw() which defers execution.
    try {
      await db.rawQuery('CREATE EXTENSION IF NOT EXISTS postgis')
    } catch {
      // PostGIS is not available — skip the geography column gracefully.
      return
    }

    await db.rawQuery(
      'ALTER TABLE courts ADD COLUMN IF NOT EXISTS geography geography(Point,4326)'
    )
    await db.rawQuery(
      `UPDATE courts SET geography = ST_MakePoint(longitude::float8, latitude::float8)::geography`
    )
    await db.rawQuery(
      'CREATE INDEX IF NOT EXISTS courts_geography_idx ON courts USING GIST (geography)'
    )
  }

  async down() {
    await db.rawQuery('DROP INDEX IF EXISTS courts_geography_idx')
    await db.rawQuery('ALTER TABLE courts DROP COLUMN IF EXISTS geography')
  }
}
