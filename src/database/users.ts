import { Either, left, right } from "../../core/data/Either"
import db from "../database"
import * as JD from "decoders"

export type UserRow = {
  id: number
  name: string
  email: string
  createdAt: number
  updatedAt: number
}

export type AuthUser = UserRow

export type CreateParams = {
  name: string
  email: string
}
export type CreateErrorCode = "EMPTY_NAME" | "EMPTY_EMAIL" | "UNKNOWN_DB_ERROR"
export async function create(
  params: CreateParams,
): Promise<Either<CreateErrorCode, UserRow>> {
  const { name, email } = params
  if (name.length === 0) {
    return left("EMPTY_NAME")
  }
  if (email.length === 0) {
    return left("EMPTY_EMAIL")
  }

  const now = Date.now()

  return db
    .insert({
      name,
      email,
      createdAt: now,
      updatedAt: now,
    })
    .returning("*")
    .then((rows) => rows[0])
    .then(userRowDecoder.verify)
    .then(right<CreateErrorCode, UserRow>)
    .catch((e) => {
      console.error("#users.create error", e)
      return left("UNKNOWN_DB_ERROR")
    })
}

export async function getByID(userID: UserRow["id"]): Promise<UserRow | null> {
  return db
    .select()
    .where({ id: userID })
    .then((rows) => rows[0])
    .then((row) => (row == null ? null : userRowDecoder.verify(row)))
    .catch((e) => {
      console.error("#users.getByID error", e)
      return null
    })
}

const userRowDecoder: JD.Decoder<UserRow> = JD.object({
  id: JD.number,
  name: JD.string,
  email: JD.string,
  createdAt: JD.number,
  updatedAt: JD.number,
})
