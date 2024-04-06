import * as JD from "decoders"
import { fromDecodeResult, isRight } from "../core/data/Either"

export default load()

export type Env = {
  APP_ENV: "test" | "development" | "production"
  APP_PORT: number
  DB_HOST: string
  DB_PORT: number
  DB_USER: string
  DB_PASSWORD: string
  DB_DATABASE: string
}

const decoder: JD.Decoder<Env> = JD.object({
  APP_ENV: JD.oneOf(["test", "development", "production"]),
  APP_PORT: JD.string.transform(toNumber),
  DB_HOST: JD.string,
  DB_PORT: JD.string.transform(toNumber),
  DB_USER: JD.string,
  DB_PASSWORD: JD.string,
  DB_DATABASE: JD.string,
})

// Private

// Loads the ENV
// Throws to kill server if it fails
function load(): Env | never {
  const env = {
    APP_ENV: process.env.APP_ENV,
    APP_PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
  }

  const result = fromDecodeResult(decoder.decode(env))
  if (isRight(result)) {
    return result.value
  } else {
    console.error("Env is malformed.")
    throw new Error(JD.formatInline(result.error))
  }
}

function toNumber(s: string): number | never {
  const n = parseInt(s, 10)
  if (isNaN(n)) {
    throw new Error(`${s} is not an integer.`)
  } else {
    return n
  }
}
