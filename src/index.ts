import ENV from "./Env"
import * as Seed from "./Seed"
import app from "./App"

async function main() {
  console.info(`Seeding database idempotently...`)
  await Seed.run()
  console.info(`✅ Seeding database idempotently - completed`)

  return app.listen(ENV.APP_PORT, () => {
    console.info(`⚡️ Server is running at http://localhost:${ENV.APP_PORT}`)
  })
}

main()
