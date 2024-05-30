import * as path from "path"
import { promises } from "fs"
import { FileMigrationProvider, Migrator } from "kysely"
import db from "../src/database"

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs: promises,
    path,
    migrationFolder: path.join(__dirname, "./"),
  }),
  allowUnorderedMigrations: false,
})

migrator
  .migrateToLatest()
  .then(({ results, error }) => {
    if (error != null) throw error
    if (results == null) {
      console.log("Migration completed: Nothing to run")
      return
    }

    results.forEach((r) => {
      switch (r.status) {
        case "Success":
          console.log(
            `Migration "${r.migrationName}" was executed successfully`,
          )
          break

        case "Error":
          console.error(
            `Migration "${r.migrationName}" was executed unsuccessfully`,
          )
          break

        case "NotExecuted":
          console.info(`Migration "${r.migrationName}" was not executed`)
          break
      }
    })
  })
  .catch((error) => {
    console.error(`Migration error: ${error}`)
    process.exit(1)
  })