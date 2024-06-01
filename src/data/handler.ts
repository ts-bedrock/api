import * as JD from "decoders"
import * as Express from "express"
import {
  Either,
  fromDecodeResult,
  left,
  right,
} from "../../../core/data/Either"
import { UserRow } from "../database/user"
import {
  UrlRecord,
  ResponseJson,
  AuthResponseJson,
  PublicApi,
  AuthApi,
} from "../../../core/data/Api"
import { err400, internalErr500, ok200, unauthorised } from "./response"
import * as Jwt from "./jwt"
import * as UserDb from "../database/user"

/** Handler type is a "pure" function that takes any P as params
 * and returns a Promise that resolves to Either<E, T>
 * It is deliberately decoupled from ExpressJS
 * or any other server package so that it is easy to test and
 * allows reusing with other codes
 * */
export type PublicHandler<P, E, T> = (params: P) => Promise<Either<E, T>>

export type AuthHandler<P, E, T> = (
  user: AuthUser,
  params: P,
) => Promise<Either<E, T>>

export type AuthUser = UserRow

/** Creates a public API endpoint */
export function publicApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PublicApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: PublicHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  const { method, route, urlDecoder, bodyDecoder } = contract
  const handlerRunner = catchCallback((req, res) => {
    return runPublicHandler(urlDecoder, bodyDecoder, handler, req, res)
  })

  switch (method) {
    case "GET":
      app.get(removeQuery(route), handlerRunner)
      break
    case "POST":
      app.post(removeQuery(route), handlerRunner)
      break
    case "PATCH":
      app.patch(removeQuery(route), handlerRunner)
      break
    case "PUT":
      app.put(removeQuery(route), handlerRunner)
      break
    case "DELETE":
      app.delete(removeQuery(route), handlerRunner)
      break
  }
}

/** Creates a auth API endpoint */
export function authApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: AuthApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: AuthHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  const { method, route, urlDecoder, bodyDecoder } = contract
  const handlerRunner = catchCallback((req, res) => {
    return runAuthHandler(urlDecoder, bodyDecoder, handler, req, res)
  })

  switch (method) {
    case "GET":
      app.get(removeQuery(route), handlerRunner)
      break
    case "POST":
      app.post(removeQuery(route), handlerRunner)
      break
    case "PATCH":
      app.patch(removeQuery(route), handlerRunner)
      break
    case "PUT":
      app.put(removeQuery(route), handlerRunner)
      break
    case "DELETE":
      app.delete(removeQuery(route), handlerRunner)
      break
  }
}

// Internal

async function runPublicHandler<UrlParams, RequestBody, ErrorCode, Payload>(
  urlDecoder: JD.Decoder<UrlParams>,
  bodyDecoder: JD.Decoder<RequestBody>,
  handler: PublicHandler<UrlParams & RequestBody, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<ResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  // Decoder errors are treated as 500 internal errors
  // Because our typescript should guarantee this
  // and it should not happen in production
  const paramsResult = decodeParams(req, urlDecoder, bodyDecoder)
  if (paramsResult._t === "Left")
    return internalErr500(
      res,
      paramsResult.error,
      decoderErrorMessage(req.query, paramsResult.error),
    )
  const params = paramsResult.value

  return handler(params)
    .then((result) => {
      return result._t === "Right"
        ? ok200(res, result.value)
        : err400(res, result.error)
    })
    .catch((error) => {
      // Uncaught exception from handler
      // will be treated as 500 internal errors
      return internalErr500(
        res,
        error,
        internalErrMessage("Handler Uncaught Exception", req.query, error),
      )
    })
}

async function runAuthHandler<UrlParams, RequestBody, ErrorCode, Payload>(
  urlDecoder: JD.Decoder<UrlParams>,
  bodyDecoder: JD.Decoder<RequestBody>,
  handler: AuthHandler<UrlParams & RequestBody, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<AuthResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  try {
    const jwtPayload = await verifyToken(req)
    if (jwtPayload._t === "Left") return unauthorised(res, jwtPayload.error)

    const { userID } = jwtPayload.value
    const user = await UserDb.getByID(userID)
    if (user == null)
      return unauthorised(res, `Invalid user with id ${userID.unwrap()}`)

    const paramsResult = decodeParams(req, urlDecoder, bodyDecoder)
    if (paramsResult._t === "Left")
      return internalErr500(
        res,
        paramsResult.error,
        decoderErrorMessage(req.query, paramsResult.error),
      )

    return handler(user, paramsResult.value)
      .then((result) =>
        result._t === "Right"
          ? ok200(res, result.value)
          : err400(res, result.error),
      )
      .catch((error) =>
        // Uncaught exception from handler
        // will be treated as 500 internal errors
        internalErr500(
          res,
          error,
          internalErrMessage("Handler Uncaught Exception", req.query, error),
        ),
      )
  } catch (error) {
    return internalErr500(
      res,
      error,
      internalErrMessage("Handler Uncaught Exception", req.query, error),
    )
  }
}

function decodeParams<UrlParams, RequestBody>(
  req: Express.Request,
  urlDecoder: JD.Decoder<UrlParams>,
  bodyDecoder: JD.Decoder<RequestBody>,
): Either<unknown, UrlParams & RequestBody> {
  // Decoder errors are treated as 500 internal errors
  // Because our typescript should guarantee this
  // and it should not happen in production
  const urlResult = fromDecodeResult(
    urlDecoder.decode({ ...req.query, ...req.params }),
  )
  if (urlResult._t === "Left") return left(urlResult.error)

  const bodyResult = fromDecodeResult(bodyDecoder.decode(req.body))
  if (bodyResult._t === "Left") return left(bodyResult.error)

  return right({ ...urlResult.value, ...bodyResult.value })
}

async function verifyToken(
  req: Express.Request,
): Promise<Either<string, Jwt.Payload>> {
  const { authorization } = req.headers
  if (authorization == null || authorization.startsWith("Bearer ") === false) {
    return left(`Invalid authorization header: ${authorization}`)
  } else {
    const token = authorization.slice(7)
    return Jwt.verify(token)
  }
}

function removeQuery(route: string): string {
  return route.split("?")[0] || ""
}

/** An error thrown in a callback cannot be caught in the same closure
 * Hence, we have to wrapped the function itself in a try..catch
 * and return it as a higher-order function to be used as a callback
 ***/
function catchCallback(
  fn: (req: Express.Request, res: Express.Response) => void,
) {
  return function (req: Express.Request, res: Express.Response) {
    try {
      return fn(req, res)
    } catch (error) {
      return internalErr500(
        res,
        error,
        internalErrMessage("API Uncaught Exception", req.query, error),
      )
    }
  }
}

function decoderErrorMessage<P>(params: P, error: unknown): string {
  return internalErrMessage("Params Decoder Failed", params, error)
}

function internalErrMessage<E, P>(title: string, params: P, error: E): string {
  const errorMessages = [
    title,
    "Params: " + JSON.stringify(params),
    "Error: " + String(error),
  ]
  return errorMessages.join("\n")
}
