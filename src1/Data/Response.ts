import * as Express from "express"
import { md5 } from "pure-md5"
import { Ok200, Err400, InternalErr500 } from "../../../core/data/Api"

export function ok200<D>(res: Express.Response<Ok200<D>>, data: D): void {
  res.status(200)
  res.json({ _t: "Ok", data })
  return
}

export function err400<E>(
  res: Express.Response<Err400<E>>,
  errorCode: E,
): void {
  res.status(400)
  res.json({ _t: "Err", code: errorCode })
  return
}

export function internalErr500(
  res: Express.Response<InternalErr500>,
  error: unknown,
  errorMessage: string,
): void {
  // Generate a unique id to send to user
  // so user can report this id for us to track the error
  const errorID = md5(errorMessage).slice(0, 9)
  console.error(`${errorID}: ${errorMessage}`)
  console.error(error)
  res.status(500)
  res.json({ _t: "ServerError", errorID })
  return
}

// Specific response

export function unauthorised(
  res: Express.Response<Err400<"UNAUTHORISED">>,
  errorMessage: string,
): void {
  console.error(`UNAUTHORISED: ${errorMessage}`)
  res.status(400)
  res.json({ _t: "Err", code: "UNAUTHORISED" })
  return
}
