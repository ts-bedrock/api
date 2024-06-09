import * as UserRow from "../src/Database/UserRow"
import * as Hash from "../src/Data/Hash"
import { createEmail } from "../../core/Data/User/Email"
import { fromRight } from "./Either"
import { fromJust } from "./Maybe"
import { createName } from "../../core/Data/User/Name"

export async function createUser(
  emailS: string,
  userData?: Partial<UserRow.CreateParams>,
): Promise<UserRow.UserRow> {
  const hashedPassword = await Hash.issue("123123").then(fromJust)
  const email = fromJust(createEmail(emailS))
  const params = {
    name: fromJust(createName("David")),
    hashedPassword,
  }

  const user = await UserRow.create({
    ...params,
    ...userData,
    email,
  }).then(fromRight)

  return user
}
