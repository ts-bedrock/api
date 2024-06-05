import * as API from "../../../../core/Api/User/List"
import { Either, right } from "../../../../core/Data/Either"
import { AuthUser } from "../../Data/Handler"
import { toUser } from "../../Data/User"
import * as UserDb from "../../Database/User"

export default async function handler(
  _currentUser: AuthUser,
  params: API.UrlParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { lastID, limit } = params
  const userRows = await UserDb.pagination(lastID, limit)
  return right(userRows.map(toUser))
}
