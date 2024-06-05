import { PositiveInt, positiveIntDecoder } from "../../../core/data/PositiveInt"
import {
  NoneNegativeInt,
  noneNegativeIntDecoder,
} from "../../../core/data/NoneNegativeInt"
import { Either, left, right } from "../../../core/data/Either"
import { fromMaybe } from "../../../core/data/Maybe"
import db from "../database"
import * as JD from "decoders"
import { Text100, text100Decoder } from "../../../core/data/Text/Text100"
import { Email, emailDecoder } from "../../../core/data/user/Email"
import {
  numberFromStringDecoder,
  stringNumberDecoder,
} from "../../../core/data/Decoder"
import {
  Timestamp,
  createTimestamp,
  timestampDecoder,
} from "../../../core/data/Timestamp"
import { Generated } from "kysely"

export type UserTable = {
  id: Generated<number>
  name: string
  email: string
  password: string
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

export type CreateParams = {
  name: Text100
  email: Email
  hashedPassword: string
}
export type CreateErrorCode = "DATA_ERROR" | "UNKNOWN_DB_ERROR"
export async function create(
  params: CreateParams,
): Promise<Either<CreateErrorCode, UserRow>> {
  const { name, email, hashedPassword } = params

  const now = fromMaybe(createTimestamp(Date.now()))
  if (now == null) return left("DATA_ERROR")

  return db
    .insertInto("user")
    .values({
      name: name.unwrap(),
      email: email.unwrap(),
      password: hashedPassword,
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

export async function getHashedPasswordByEmail(
  email: Email,
): Promise<string | null> {
  return db
    .selectFrom("user")
    .select(["password"])
    .where("user.email", "=", email.unwrap())
    .executeTakeFirst()
    .then((r) =>
      r == null
        ? null
        : JD.object({
            password: JD.string,
          }).verify(r).password,
    )
    .catch((e) => {
      console.error("#users.getHashedPasswordByEmail error", e)
      throw e
    })
}

export async function getByID(userID: PositiveInt): Promise<UserRow | null> {
  return db
    .selectFrom("user")
    .selectAll()
    .where("user.id", "=", userID.unwrap())
    .executeTakeFirst()
    .then((r) => (r == null ? null : userRowDecoder.verify(r)))
    .catch((e) => {
      console.error("#users.getByID error", e)
      throw e
    })
}

export async function getByEmail(email: Email): Promise<UserRow | null> {
  return db
    .selectFrom("user")
    .selectAll()
    .where("user.email", "=", email.unwrap())
    .executeTakeFirst()
    .then((r) => (r == null ? null : userRowDecoder.verify(r)))
    .catch((e) => {
      console.error("#users.getByEmail error", e)
      throw e
    })
}

export async function pagination(
  lastID: PositiveInt | null,
  limit: PositiveInt,
): Promise<UserRow[]> {
  return db
    .selectFrom("user")
    .selectAll()
    .where((eb) => {
      const conditons =
        lastID != null ? [eb("user.id", "<", lastID.unwrap())] : []
      return eb.and(conditons)
    })
    .orderBy("id", "desc")
    .limit(limit.unwrap())
    .execute()
    .then((r) => JD.array(userRowDecoder).verify(r))
    .catch((e) => {
      console.error("#users.pagination error", e)
      throw e
    })
}

export async function count(): Promise<NoneNegativeInt> {
  return db
    .selectFrom("user")
    .select([(b) => b.fn.count("user.id").as("total")])
    .executeTakeFirstOrThrow()
    .then(
      (r) =>
        JD.object({
          total: stringNumberDecoder.transform((v) =>
            noneNegativeIntDecoder.verify(v),
          ),
        }).verify(r).total,
    )
    .catch((e) => {
      console.error("#users.count error", e)
      throw e
    })
}

const userRowDecoder: JD.Decoder<UserRow> = JD.object({
  id: positiveIntDecoder,
  name: text100Decoder,
  email: emailDecoder,
  createdAt: numberFromStringDecoder.transform(timestampDecoder.verify),
  updatedAt: numberFromStringDecoder.transform(timestampDecoder.verify),
})
