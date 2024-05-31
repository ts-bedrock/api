import ENV from "./env"
import * as Seed from "./seed"
import app from "./app"

async function main() {
  console.info(`Seeding database idempotently...`)
  await Seed.run()
  console.info(`✅ Seeding database idempotently - completed`)

  return app.listen(ENV.APP_PORT, () => {
    console.info(`⚡️ Server is running at http://localhost:${ENV.APP_PORT}`)
  })
}

main()
