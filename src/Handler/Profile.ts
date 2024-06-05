import * as API from "../../../core/Api/Profile"
import { Either, right } from "../../../core/Data/Either"
import { AuthUser } from "../Data/Handler"
import { toUser } from "../Data/User"

export default async function handler(
  currentUser: AuthUser,
  _params: unknown,
): Promise<Either<API.ErrorCode, API.Payload>> {
  return right(toUser(currentUser))
}
