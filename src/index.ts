import ENV from "./Env"
import * as Seed from "./Seed"
import Api from "./Api"
import * as Logger from "./Data/Logger"

async function main() {
  Logger.log(`Seeding database idempotently...`)
  await Seed.run()
  Logger.log(`✅ Seeding database idempotently - completed`)

  return Api.listen(ENV.APP_PORT, () => {
    Logger.log(`⚡️ Server is running at http://localhost:${ENV.APP_PORT}`)
  })
}

main()
