import * as API from "../../../core/api/Profile"
import { Either, right } from "../../../core/data/Either"
import { AuthUser } from "../data/handler"

export default async function handler(
  currentUser: AuthUser,
  _params: unknown,
): Promise<Either<API.ErrorCode, API.Payload>> {
  return right(currentUser)
}
