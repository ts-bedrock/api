import { Pool } from "pg"
import { Kysely, PostgresDialect } from "kysely"
import ENV from "./Env"

type Schema = {
  user: UserTable
}

type UserTable = {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
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
