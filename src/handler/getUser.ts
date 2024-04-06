import * as API from "../../core/api/GetUser"
import { Either, left, right } from "../../core/data/Either"
import * as UserDb from "../database/users"

export default async function handler(
  _currentUser: UserDb.AuthUser,
  params: API.UrlParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { userID } = params

  const userRow = await UserDb.getByID(userID)

  if (userRow == null) {
    return left("USER_NOT_FOUND")
  }

  return right(userRow)
}
