import * as UserDb from "../src/Database/User"
import * as Hash from "../src/Data/Hash"
import { createEmail } from "../../core/Data/User/Email"
import { createText100 } from "../../core/Data/Text/Text100"
import { fromRight } from "./Either"
import { fromJust } from "./Maybe"

export async function createUser(
  emailS: string,
  userData?: Partial<UserDb.CreateParams>,
): Promise<UserDb.UserRow> {
  const hashedPassword = await Hash.issue("123123").then(fromJust)
  const email = fromJust(createEmail(emailS))
  const params = {
    name: fromJust(createText100("David")),
    hashedPassword,
  }

  const user = await UserDb.create({
    ...params,
    ...userData,
    email,
  }).then(fromRight)

  return user
}
