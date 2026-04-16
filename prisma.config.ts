import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { config as loadEnv } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

const root = process.cwd()
if (existsSync(resolve(root, '.env'))) {
  loadEnv({ path: resolve(root, '.env') })
}
if (existsSync(resolve(root, '.env.local'))) {
  loadEnv({ path: resolve(root, '.env.local'), override: true })
}

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
