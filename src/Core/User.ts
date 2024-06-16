import { User } from "../../../core/App/User"
import { UserRow } from "../Database/UserRow"

export function toUser(row: UserRow): User {
  const { id, name, email } = row
  return { id, name, email }
}
