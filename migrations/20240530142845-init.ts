import { Kysely } from "kysely"

// Why `unknown`? Read more here https://kysely.dev/docs/migrations
export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar(100)", (col) => col.notNull())
    .addColumn("email", "varchar(320)", (col) => col.notNull())
    .addColumn("createdAt", "numeric", (col) => col.notNull())
    .addColumn("updatedAt", "numeric", (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("user").execute()
}
