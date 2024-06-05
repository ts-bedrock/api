import * as UserDb from "../src/database/user"
import * as Hash from "../src/data/hash"
import { createEmail } from "../../core/data/user/Email"
import { createText100 } from "../../core/data/Text/Text100"
import { fromRight } from "./either"
import { fromJust } from "./maybe"

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
