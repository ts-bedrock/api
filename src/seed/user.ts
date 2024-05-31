import { fromMaybe } from "../../../core/data/Maybe"
import { createText100 } from "../../../core/data/Text/Text100"
import { createEmail } from "../../../core/data/user/Email"
import * as Hash from "../data/hash"
import * as UserDb from "../database/user"

export async function seedDev(): Promise<void> {
  const total = await UserDb.count()
  if (total.unwrap() > 0) return

  const password = "123123"
  const hashedPassword = await Hash.issue(password)
  if (hashedPassword == null) return

  await Promise.all(
    [
      userParams("David", "david@example.com", hashedPassword),
      userParams("Mary", "mary@example.com", hashedPassword),
      userParams("James", "james@example.com", hashedPassword),
      userParams("Jane", "jane@example.com", hashedPassword),
      userParams("Bob", "bob@example.com", hashedPassword),
      userParams("Alice", "alice@example.com", hashedPassword),
    ].map(UserDb.create),
  )
}

function userParams(
  nameS: string,
  emailS: string,
  hashedPassword: string,
): UserDb.CreateParams {
  const name = fromMaybe(createText100(nameS))
  const email = fromMaybe(createEmail(emailS))
  if (name == null || email == null) throw `Seed user error`
  return { name, email, hashedPassword }
}