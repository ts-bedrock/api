import * as API from "../../../../core/Api/User/Detail"
import { Either, left, right } from "../../../../core/Data/Either"
import { AuthUser } from "../../Data/Handler"
import { toUser } from "../../Data/User"
import * as UserDb from "../../Database/User"

export default async function handler(
  _currentUser: AuthUser,
  params: API.UrlParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const userRow = await UserDb.getByID(params.userID)
  if (userRow == null) return left("USER_NOT_FOUND")
  return right(toUser(userRow))
}
