import { PositiveInt } from "../../../core/Data/Number/PositiveInt"
import { Nat, natDecoder } from "../../../core/Data/Number/Nat"
import { Either, left, right } from "../../../core/Data/Either"
import db from "../Database"
import * as JD from "decoders"
import { Email, emailDecoder } from "../../../core/Data/User/Email"
import { stringNumberDecoder } from "../../../core/Data/Decoder"
import {
  Timestamp,
  createNow,
  timestampDecoder,
} from "../../../core/Data/Timestamp"
import { Hash } from "../Data/Hash"
import * as Logger from "../Data/Logger"
import { UserID, createUserID, userIDDecoder } from "../../../core/App/User"
import { Name, nameDecoder } from "../../../core/Data/User/Name"

export type UserRow = {
  id: UserID
  name: Name
  email: Email
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type CreateParams = {
  name: Name
  email: Email
  hashedPassword: Hash
}
export type CreateErrorCode = "UNKNOWN_DB_ERROR"
export async function create(
  params: CreateParams,
): Promise<Either<CreateErrorCode, UserRow>> {
  const { name, email, hashedPassword } = params

  const now = createNow()
  return db
    .insertInto("user")
    .values({
      id: createUserID().unwrap(),
      name: name.unwrap(),
      email: email.unwrap(),
      password: hashedPassword.unwrap(),
      createdAt: new Date(now.unwrap()),
      updatedAt: new Date(now.unwrap()),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(userRowDecoder.verify)
    .then(right)
    .catch((e) => {
      Logger.error(`#users.create error ${e}`)
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
      Logger.error(`#users.getHashedPasswordByEmail error ${e}`)
      throw e
    })
}

export async function getByID(userID: UserID): Promise<UserRow | null> {
  return db
    .selectFrom("user")
    .selectAll()
    .where("user.id", "=", userID.unwrap())
    .executeTakeFirst()
    .then((r) => (r == null ? null : userRowDecoder.verify(r)))
    .catch((e) => {
      Logger.error(`#users.getByID error ${e}`)
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
      Logger.error(`#users.getByEmail error ${e}`)
      throw e
    })
}

export async function pagination(
  limit: PositiveInt,
  offset: Nat,
): Promise<UserRow[]> {
  return db
    .selectFrom("user")
    .selectAll()
    .orderBy("createdAt", "desc")
    .limit(limit.unwrap())
    .offset(offset.unwrap())
    .execute()
    .then((r) => JD.array(userRowDecoder).verify(r))
    .catch((e) => {
      Logger.error(`#users.pagination error ${e}`)
      throw e
    })
}

export async function count(): Promise<Nat> {
  return db
    .selectFrom("user")
    .select([(b) => b.fn.count("user.id").as("total")])
    .executeTakeFirstOrThrow()
    .then(
      (r) =>
        JD.object({
          total: stringNumberDecoder.transform((v) => natDecoder.verify(v)),
        }).verify(r).total,
    )
    .catch((e) => {
      Logger.error(`#users.count error ${e}`)
      throw e
    })
}

const userRowDecoder: JD.Decoder<UserRow> = JD.object({
  id: userIDDecoder,
  name: nameDecoder,
  email: emailDecoder,
  createdAt: JD.date.transform((v) => timestampDecoder.verify(v.getTime())),
  updatedAt: JD.date.transform((v) => timestampDecoder.verify(v.getTime())),
})
