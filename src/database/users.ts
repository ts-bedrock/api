import { PositiveInt, positiveIntDecoder } from "../../../core/data/PositiveInt"
import { Either, left, right } from "../../../core/data/Either"
import { fromMaybe } from "../../../core/data/Maybe"
import db from "../database"
import * as JD from "decoders"
import { Text100, text100Decoder } from "../../../core/data/Text/Text100"
import { Email, emailDecoder } from "../../../core/data/user/Email"
import {
  Timestamp,
  createTimestamp,
  timestampDecoder,
} from "../../../core/data/Timestamp"
import { Generated } from "kysely"

export const tableName = "user"

export type UserTable = {
  id: Generated<number>
  name: string
  email: string
  createdAt: number
  updatedAt: number
}

export type UserRow = {
  id: PositiveInt
  name: Text100
  email: Email
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type AuthUser = UserRow

export type CreateParams = {
  name: Text100
  email: Email
}
export type CreateErrorCode = "EMPTY_NAME" | "DATA_ERROR" | "UNKNOWN_DB_ERROR"
export async function create(
  params: CreateParams,
): Promise<Either<CreateErrorCode, UserRow>> {
  const { name, email } = params
  if (name.unwrap().length === 0) {
    return left("EMPTY_NAME")
  }

  const now = fromMaybe(createTimestamp(Date.now()))
  if (now == null) return left("DATA_ERROR")

  return db
    .insertInto(tableName)
    .values({
      name: name.unwrap(),
      email: email.unwrap(),
      createdAt: now.unwrap(),
      updatedAt: now.unwrap(),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(userRowDecoder.verify)
    .then(right)
    .catch((e) => {
      console.error("#users.create error", e)
      return left("UNKNOWN_DB_ERROR")
    })
}

export async function getByID(userID: PositiveInt): Promise<UserRow | null> {
  return db
    .selectFrom(tableName)
    .selectAll()
    .where("user.id", "==", userID.unwrap())
    .executeTakeFirstOrThrow()
    .then(userRowDecoder.verify)
    .catch((e) => {
      console.error("#users.getByID error", e)
      return null
    })
}

const userRowDecoder: JD.Decoder<UserRow> = JD.object({
  id: positiveIntDecoder,
  name: text100Decoder,
  email: emailDecoder,
  createdAt: timestampDecoder,
  updatedAt: timestampDecoder,
})
