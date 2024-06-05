import db from "../src/database"

// Delete all rows in every table at the start of each test
beforeEach(async () => {
  // Delete all data in database
  await Promise.all([db.deleteFrom("user").execute()])
})

afterAll(async () => {
  // Kill knex otherwise it will cause warning
  // that a worker process did not exit gracefully
  await db.destroy()
})
