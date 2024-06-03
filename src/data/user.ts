import { User } from "../../../core/app/User"
import * as UserDb from "../database/user"

export function toUser(row: UserDb.UserRow): User {
  const { id, name, email } = row
  return { id, name, email }
}
