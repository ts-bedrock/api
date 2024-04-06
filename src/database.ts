import type { Knex } from "knex"
import { knex } from "knex"
import ENV from "./env"

export const config: Knex.Config = {
  client: "mssql",
  connection: {
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_DATABASE,
  },
  migrations: {
    directory: "./migrations",
    tableName: "knex_migrations",
    loadExtensions: [".ts", ".js"],
  },
}

const db = knex(config)
export default db
