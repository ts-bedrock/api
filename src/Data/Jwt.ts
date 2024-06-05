import * as JD from "decoders"
import * as jose from "jose"
import ENV from "../Env"
import { Either, left, right } from "../../../core/Data/Either"
import { Opaque } from "../../../core/Data/Opaque"
import { PositiveInt, positiveIntDecoder } from "../../../core/Data/PositiveInt"

const key: unique symbol = Symbol()
export type Token = Opaque<string, typeof key>
export type Payload = { userID: PositiveInt }

const jwt_config = {
  // HS256 = HMAC 256-bits which is "fastest"
  // Make sure secret string is at least 256 length too
  // Ref: https://fusionauth.io/articles/tokens/building-a-secure-jwt
  algorithm: "HS256",
  secret: new TextEncoder().encode(ENV.JWT_SECRET),
  expirationTime: "7d",
}

export async function issue(userID: PositiveInt): Promise<Token> {
  const token = await new jose.SignJWT({ userID: userID.unwrap() })
    .setProtectedHeader({ alg: jwt_config.algorithm })
    .setExpirationTime(jwt_config.expirationTime)
    .sign(jwt_config.secret)

  return {
    [key]: token,
    unwrap: () => token,
    toJSON: () => token,
  }
}

export async function verify(tokenS: string): Promise<Either<string, Payload>> {
  try {
    const jwtResult = await jose.jwtVerify(tokenS, jwt_config.secret)
    return right(payloadDecoder.verify(jwtResult.payload))
  } catch (error) {
    return left(String(error))
  }
}

export const payloadDecoder: JD.Decoder<Payload> = JD.object({
  userID: JD.number.transform(positiveIntDecoder.verify),
})
