import { Kysely } from "kysely"

// Why `unknown`? Read more here https://kysely.dev/docs/migrations
export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "varchar(36)", (col) =>
      col.notNull().unique().primaryKey(),
    )
    .addColumn("name", "varchar(100)", (col) => col.notNull())
    .addColumn("email", "varchar(320)", (col) => col.notNull().unique())
    .addColumn("password", "varchar", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) => col.notNull())
    .addColumn("updatedAt", "timestamp", (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("user").execute()
}
