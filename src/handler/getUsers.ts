import * as API from "../../../core/api/GetUsers"
import { Either, right } from "../../../core/data/Either"
import { AuthUser } from "../data/handler"
import * as UserDb from "../database/user"

export default async function handler(
  _currentUser: AuthUser,
  params: API.UrlParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { lastID, limit } = params
  const userRows = await UserDb.pagination(lastID, limit)
  return right(userRows)
}
