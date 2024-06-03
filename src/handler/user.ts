import * as API from "../../../core/api/User"
import { Either, left, right } from "../../../core/data/Either"
import { AuthUser } from "../data/handler"
import { toUser } from "../data/user"
import * as UserDb from "../database/user"

export default async function handler(
  _currentUser: AuthUser,
  params: API.UrlParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const userRow = await UserDb.getByID(params.userID)
  if (userRow == null) return left("USER_NOT_FOUND")
  return right(toUser(userRow))
}
