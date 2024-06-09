import { fromMaybe } from "../../../core/Data/Maybe"
import { createEmail } from "../../../core/Data/User/Email"
import { createName } from "../../../core/Data/User/Name"
import * as Hash from "../Data/Hash"
import * as UserRow from "../Database/UserRow"

export async function seedDev(): Promise<void> {
  const total = await UserRow.count()
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
    ].map(UserRow.create),
  )
}

function userParams(
  nameS: string,
  emailS: string,
  hashedPassword: Hash.Hash,
): UserRow.CreateParams {
  const name = fromMaybe(createName(nameS))
  const email = fromMaybe(createEmail(emailS))
  if (name == null || email == null) throw `Seed user error`
  return { name, email, hashedPassword }
}
