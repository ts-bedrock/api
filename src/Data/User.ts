import { User } from "../../../core/App/User"
import * as UserDb from "../Database/User"

export function toUser(row: UserDb.UserRow): User {
  const { id, name, email } = row
  return { id, name, email }
}
