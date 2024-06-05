import { Pool } from "pg"
import { Kysely, PostgresDialect } from "kysely"
import ENV from "./env"
import type { UserTable } from "./database/user"

type Schema = {
  user: UserTable
}

const dialect = new PostgresDialect({
  pool: new Pool({
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_DATABASE,
    max: ENV.DB_MAX_POOL,
  }),
})

const db = new Kysely<Schema>({
  dialect,
})

export default db
