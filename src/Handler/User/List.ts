import * as API from "../../../../core/Api/User/List"
import { Either, right } from "../../../../core/Data/Either"
import { AuthUser } from "../../Data/Handler"
import { toUser } from "../../Core/User"
import * as UserRow from "../../Database/UserRow"

export default async function handler(
  _currentUser: AuthUser,
  params: API.UrlParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { offset, limit } = params
  const userRows = await UserRow.pagination(limit, offset)
  return right(userRows.map(toUser))
}
