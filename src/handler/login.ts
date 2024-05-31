import * as API from "../../../core/api/Login"
import { Either, left, right } from "../../../core/data/Either"
import * as UserDb from "../database/user"
import * as Hash from "../data/hash"
import * as Jwt from "../data/jwt"

export default async function handler(
  params: API.BodyParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { email, password } = params

  const hashedPassword = await UserDb.getHashedPasswordByEmail(email)
  if (hashedPassword == null) return left("USER_NOT_FOUND")

  const isValidPassword = await Hash.verify(password.unwrap(), hashedPassword)
  if (isValidPassword === false) return left("INVALID_PASSWORD")

  const userRow = await UserDb.getByEmail(email)
  if (userRow == null) return left("USER_NOT_FOUND")

  const token = await Jwt.issue(userRow.id)

  return right({ user: userRow, token: token.unwrap() })
}
