import ENV from "./env"
import * as User from "./seed/user"

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
