import * as JD from "decoders"
import * as jose from "jose"
import ENV from "../Env"
import { Either, left, right } from "../../../core/Data/Either"
import { Opaque, jsonValueCreate } from "../../../core/Data/Opaque"
import * as Logger from "./Logger"
import { UserID, userIDDecoder } from "../../../core/App/User"

const key: unique symbol = Symbol()
export type Token = Opaque<string, typeof key>
export type Payload = { userID: UserID }

const jwt_config = {
  // HS256 = HMAC 256-bits which is "fastest"
  // Make sure secret string is at least 256 length too
  // Ref: https://fusionauth.io/articles/tokens/building-a-secure-jwt
  algorithm: "HS256",
  secret: new TextEncoder().encode(ENV.JWT_SECRET),
  expirationTime: "7d",
}

export async function issue(userID: UserID): Promise<Token> {
  return new jose.SignJWT({ userID: userID.unwrap() })
    .setProtectedHeader({ alg: jwt_config.algorithm })
    .setExpirationTime(jwt_config.expirationTime)
    .sign(jwt_config.secret)
    .then((token) => jsonValueCreate<string, typeof key>(key)(token))
    .catch((error) => {
      Logger.error(`jwt issue error: ${error}`)
      throw `jwt issue error: ${error}`
    })
}

export async function verify(tokenS: string): Promise<Either<string, Payload>> {
  return jose
    .jwtVerify(tokenS, jwt_config.secret)
    .then((jwtResult) => right(payloadDecoder.verify(jwtResult.payload)))
    .catch((error) => left(String(error)))
}

export const payloadDecoder: JD.Decoder<Payload> = JD.object({
  userID: userIDDecoder,
})
