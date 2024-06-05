import * as bcrypt from "bcrypt"
import { Maybe, nothing } from "../../../core/Data/Maybe"

export async function issue(password: string): Promise<Maybe<string>> {
  const saltRounds = 10 // We use auto-gen salt with saltRounds 10 as recommend
  return bcrypt.hash(password, saltRounds).catch((error) => {
    console.error(`bcrypt hash error: `, error)
    return nothing()
  })
}

export async function verify(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword).catch((error) => {
    console.error(`bcrypt check error: `, error)
    return false
  })
}
