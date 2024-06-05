import ENV from "./Env"
import * as User from "./Seed/User"

export async function run(): Promise<void | never> {
  const { APP_ENV } = ENV

  switch (APP_ENV) {
    case "production":
    case "test":
      return

    case "development":
      await User.seedDev()
      return
  }
}
