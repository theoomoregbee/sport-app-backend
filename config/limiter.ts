import { defineConfig, stores } from '@adonisjs/limiter'

const limiterConfig = defineConfig({
  default: 'database',
  stores: {
    /**
     * PostgreSQL-backed store — survives restarts and works across
     * multiple app instances. Uses the existing Lucid DB connection.
     */
    database: stores.database({
      tableName: 'rate_limits',
    }),

    /**
     * In-memory store for local dev or tests.
     */
    memory: stores.memory({}),
  },
})

export default limiterConfig

declare module '@adonisjs/limiter/types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface LimitersList extends InferLimiters<typeof limiterConfig> {}
}
