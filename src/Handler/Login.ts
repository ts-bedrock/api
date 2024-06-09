import * as API from "../../../core/Api/Login"
import { Either, left, right } from "../../../core/Data/Either"
import * as UserRow from "../Database/UserRow"
import * as Hash from "../Data/Hash"
import * as Jwt from "../Data/Jwt"
import { toUser } from "../Core/User"

export default async function handler(
  params: API.BodyParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { email, password } = params

  const hashedPassword = await UserRow.getHashedPasswordByEmail(email)
  if (hashedPassword == null) return left("USER_NOT_FOUND")

  const isValidPassword = await Hash.verify(password.unwrap(), hashedPassword)
  if (isValidPassword === false) return left("INVALID_PASSWORD")

  const userRow = await UserRow.getByEmail(email)
  if (userRow == null) return left("USER_NOT_FOUND")

  const token = await Jwt.issue(userRow.id)

  return right({ user: toUser(userRow), token: token.unwrap() })
}
