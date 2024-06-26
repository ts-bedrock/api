import * as JD from "decoders"
import * as Express from "express"
import { Readable } from "stream"
import {
  Either,
  fromDecodeResult,
  left,
  right,
} from "../../../core/Data/Either"
import type {
  UrlRecord,
  ResponseJson,
  AuthResponseJson,
  PublicApi,
  PublicNoneBodyApi,
  AuthApi,
  AuthNoneBodyApi,
  GetApi,
  DeleteApi,
  PostApi,
  PatchApi,
  PutApi,
  AuthStreamApi,
  AdminStreamApi,
  AdminApi,
  AdminNoneBodyApi,
  AdminResponseJson,
} from "../../../core/Data/Api"
import { err400, internalErr500, ok200, unauthorised } from "./Response"
import * as Jwt from "./Jwt"
import * as UserRow from "../Database/UserRow"
import { Annotation } from "../../../core/Data/Decoder"

export type AuthUser = UserRow.UserRow

export function publicGetApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: GetApi<Route, UrlParams, ErrorCode, Payload>,
  handler: PublicHandler<UrlParams, ErrorCode, Payload>,
): void {
  return publicNoneBodyApi(app, contract, handler)
}

export function publicDeleteApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: DeleteApi<Route, UrlParams, ErrorCode, Payload>,
  handler: PublicHandler<UrlParams, ErrorCode, Payload>,
): void {
  return publicNoneBodyApi(app, contract, handler)
}

export function publicPostApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PostApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: PublicHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  return publicApi(app, contract, handler)
}

export function publicPutApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PutApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: PublicHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  return publicApi(app, contract, handler)
}

export function publicPatchApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PatchApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: PublicHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  return publicApi(app, contract, handler)
}

export function authGetApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: GetApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AuthHandler<UrlParams, ErrorCode, Payload>,
): void {
  return authNoneBodyApi(app, contract, handler)
}

export function authDeleteApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: DeleteApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AuthHandler<UrlParams, ErrorCode, Payload>,
): void {
  return authNoneBodyApi(app, contract, handler)
}

export function authPostApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PostApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: AuthHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  return authApi(app, contract, handler)
}

export function authPutApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PutApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: AuthHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  return authApi(app, contract, handler)
}

export function authPatchApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PatchApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: AuthHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  return authApi(app, contract, handler)
}

export function authStreamApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: AuthStreamApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AuthStreamHandler<UrlParams, ErrorCode, Payload>,
): void {
  return authStreamApi_(app, contract, handler)
}

export function adminGetApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: GetApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AdminHandler<UrlParams, ErrorCode, Payload>,
): void {
  return adminNoneBodyApi(app, contract, handler)
}

export function adminDeleteApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: DeleteApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AdminHandler<UrlParams, ErrorCode, Payload>,
): void {
  return adminNoneBodyApi(app, contract, handler)
}

export function adminPostApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PostApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: AdminHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  return adminApi(app, contract, handler)
}

export function adminPutApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PutApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: AdminHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  return adminApi(app, contract, handler)
}

export function adminPatchApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PatchApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: AdminHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  return adminApi(app, contract, handler)
}

export function adminStreamApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: AdminStreamApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AdminStreamHandler<UrlParams, ErrorCode, Payload>,
): void {
  return adminStreamApi_(app, contract, handler)
}

// Internal

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

export type AuthStreamHandler<P, E, T> = (
  user: AuthUser,
  params: P,
  readableStream: Readable,
) => Promise<Either<E, T>>

export type AdminHandler<P, E, T> = (
  user: AuthUser,
  params: P,
) => Promise<Either<E, T>>

export type AdminStreamHandler<P, E, T> = (
  user: AuthUser,
  params: P,
  readableStream: Readable,
) => Promise<Either<E, T>>

/** Creates a public API endpoint */
function publicApi<
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
    case "POST":
      app.post(removeQuery(route), handlerRunner)
      break
    case "PATCH":
      app.patch(removeQuery(route), handlerRunner)
      break
    case "PUT":
      app.put(removeQuery(route), handlerRunner)
      break
  }
}

function publicNoneBodyApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: PublicNoneBodyApi<Route, UrlParams, ErrorCode, Payload>,
  handler: PublicHandler<UrlParams, ErrorCode, Payload>,
): void {
  const { method, route, urlDecoder } = contract
  const handlerRunner = catchCallback((req, res) => {
    return runPublicNoneBodyHandler(urlDecoder, handler, req, res)
  })

  switch (method) {
    case "GET":
      app.get(removeQuery(route), handlerRunner)
      break
    case "DELETE":
      app.delete(removeQuery(route), handlerRunner)
      break
  }
}

/** Creates a auth API endpoint */
function authApi<
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
    case "POST":
      app.post(removeQuery(route), handlerRunner)
      break
    case "PATCH":
      app.patch(removeQuery(route), handlerRunner)
      break
    case "PUT":
      app.put(removeQuery(route), handlerRunner)
      break
  }
}

function authNoneBodyApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: AuthNoneBodyApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AuthHandler<UrlParams, ErrorCode, Payload>,
): void {
  const { method, route, urlDecoder } = contract
  const handlerRunner = catchCallback((req, res) => {
    return runAuthNoneBodyHandler(urlDecoder, handler, req, res)
  })

  switch (method) {
    case "GET":
      app.get(removeQuery(route), handlerRunner)
      break
    case "DELETE":
      app.delete(removeQuery(route), handlerRunner)
      break
  }
}

function authStreamApi_<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: AuthStreamApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AuthStreamHandler<UrlParams, ErrorCode, Payload>,
): void {
  const { route, urlDecoder } = contract
  const handlerRunner = catchCallback((req, res) => {
    return runAuthStreamHandler(urlDecoder, handler, req, res)
  })

  app.post(removeQuery(route), handlerRunner)
}

/** Creates an admin API endpoint */
function adminApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: AdminApi<Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: AdminHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  const { method, route, urlDecoder, bodyDecoder } = contract
  const handlerRunner = catchCallback((req, res) => {
    return runAdminHandler(urlDecoder, bodyDecoder, handler, req, res)
  })

  switch (method) {
    case "POST":
      app.post(removeQuery(route), handlerRunner)
      break
    case "PATCH":
      app.patch(removeQuery(route), handlerRunner)
      break
    case "PUT":
      app.put(removeQuery(route), handlerRunner)
      break
  }
}

function adminNoneBodyApi<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: AdminNoneBodyApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AdminHandler<UrlParams, ErrorCode, Payload>,
): void {
  const { method, route, urlDecoder } = contract
  const handlerRunner = catchCallback((req, res) => {
    return runAdminNoneBodyHandler(urlDecoder, handler, req, res)
  })

  switch (method) {
    case "GET":
      app.get(removeQuery(route), handlerRunner)
      break
    case "DELETE":
      app.delete(removeQuery(route), handlerRunner)
      break
  }
}

function adminStreamApi_<
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: AdminStreamApi<Route, UrlParams, ErrorCode, Payload>,
  handler: AdminStreamHandler<UrlParams, ErrorCode, Payload>,
): void {
  const { route, urlDecoder } = contract
  const handlerRunner = catchCallback((req, res) => {
    return runAdminStreamHandler(urlDecoder, handler, req, res)
  })

  app.post(removeQuery(route), handlerRunner)
}
async function runPublicHandler<UrlParams, RequestBody, ErrorCode, Payload>(
  urlDecoder: JD.Decoder<UrlParams>,
  bodyDecoder: JD.Decoder<RequestBody>,
  handler: PublicHandler<UrlParams & RequestBody, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<ResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const paramsResult = decodeParams(req, urlDecoder, bodyDecoder)
  return runPublicHandler_(paramsResult, handler, req, res)
}

async function runPublicNoneBodyHandler<UrlParams, ErrorCode, Payload>(
  urlDecoder: JD.Decoder<UrlParams>,
  handler: PublicHandler<UrlParams, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<ResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const paramsResult = decodeUrlParams(req, urlDecoder)
  return runPublicHandler_(paramsResult, handler, req, res)
}

async function runPublicHandler_<ErrorCode, Params, Payload>(
  paramsResult: Either<Annotation, Params>,
  handler: PublicHandler<Params, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<ResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  if (paramsResult._t === "Left")
    return internalErr500(
      res,
      paramsResult.error,
      decoderErrorMessage(req.query, paramsResult.error),
    )

  return handler(paramsResult.value)
    .then((result) => {
      return result._t === "Right"
        ? ok200(res, result.value)
        : err400(res, result.error)
    })
    .catch((error) => {
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
  const paramsResult = decodeParams(req, urlDecoder, bodyDecoder)
  return runAuthHandler_(
    paramsResult,
    { _t: "AuthHandler", fn: handler },
    req,
    res,
  )
}

async function runAuthNoneBodyHandler<UrlParams, ErrorCode, Payload>(
  urlDecoder: JD.Decoder<UrlParams>,
  handler: AuthHandler<UrlParams, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<AuthResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const paramsResult = decodeUrlParams(req, urlDecoder)
  return runAuthHandler_(
    paramsResult,
    { _t: "AuthHandler", fn: handler },
    req,
    res,
  )
}

async function runAuthStreamHandler<UrlParams, ErrorCode, Payload>(
  urlDecoder: JD.Decoder<UrlParams>,
  handler: AuthStreamHandler<UrlParams, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<AuthResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const paramsResult = decodeUrlParams(req, urlDecoder)
  return runAuthHandler_(
    paramsResult,
    { _t: "AuthStreamHandler", fn: handler },
    req,
    res,
  )
}

async function runAuthHandler_<Params, ErrorCode, Payload>(
  paramsResult: Either<Annotation, Params>,
  handler:
    | { _t: "AuthHandler"; fn: AuthHandler<Params, ErrorCode, Payload> }
    | {
        _t: "AuthStreamHandler"
        fn: AuthStreamHandler<Params, ErrorCode, Payload>
      },
  req: Express.Request,
  res: Express.Response<AuthResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const jwtPayload = await verifyToken(req)
  if (jwtPayload._t === "Left") return unauthorised(res, jwtPayload.error)

  if (paramsResult._t === "Left")
    return internalErr500(
      res,
      paramsResult.error,
      decoderErrorMessage(req.query, paramsResult.error),
    )

  const { userID } = jwtPayload.value
  const user = await UserRow.getByID(userID).catch(() => null) // Catch to prevent DB throw
  if (user == null)
    return unauthorised(res, `Invalid user with id ${userID.unwrap()}`)

  const handlerFn =
    handler._t === "AuthHandler"
      ? handler.fn(user, paramsResult.value)
      : handler.fn(user, paramsResult.value, req)

  return handlerFn
    .then((result) =>
      result._t === "Right"
        ? ok200(res, result.value)
        : err400(res, result.error),
    )
    .catch((error) =>
      internalErr500(
        res,
        error,
        internalErrMessage("Handler Uncaught Exception", req.query, error),
      ),
    )
}

async function runAdminHandler<UrlParams, RequestBody, ErrorCode, Payload>(
  urlDecoder: JD.Decoder<UrlParams>,
  bodyDecoder: JD.Decoder<RequestBody>,
  handler: AdminHandler<UrlParams & RequestBody, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<AdminResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const paramsResult = decodeParams(req, urlDecoder, bodyDecoder)
  return runAdminHandler_(
    paramsResult,
    { _t: "AdminHandler", fn: handler },
    req,
    res,
  )
}

async function runAdminNoneBodyHandler<UrlParams, ErrorCode, Payload>(
  urlDecoder: JD.Decoder<UrlParams>,
  handler: AdminHandler<UrlParams, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<AdminResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const paramsResult = decodeUrlParams(req, urlDecoder)
  return runAdminHandler_(
    paramsResult,
    { _t: "AdminHandler", fn: handler },
    req,
    res,
  )
}

async function runAdminStreamHandler<UrlParams, ErrorCode, Payload>(
  urlDecoder: JD.Decoder<UrlParams>,
  handler: AdminStreamHandler<UrlParams, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<AdminResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const paramsResult = decodeUrlParams(req, urlDecoder)
  return runAdminHandler_(
    paramsResult,
    { _t: "AdminStreamHandler", fn: handler },
    req,
    res,
  )
}

async function runAdminHandler_<Params, ErrorCode, Payload>(
  paramsResult: Either<Annotation, Params>,
  handler:
    | { _t: "AdminHandler"; fn: AdminHandler<Params, ErrorCode, Payload> }
    | {
        _t: "AdminStreamHandler"
        fn: AdminStreamHandler<Params, ErrorCode, Payload>
      },
  req: Express.Request,
  res: Express.Response<AdminResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const jwtPayload = await verifyToken(req)
  if (jwtPayload._t === "Left") return unauthorised(res, jwtPayload.error)

  if (paramsResult._t === "Left")
    return internalErr500(
      res,
      paramsResult.error,
      decoderErrorMessage(req.query, paramsResult.error),
    )

  const { userID } = jwtPayload.value
  const user = await UserRow.getByID(userID).catch(() => null) // Catch to prevent DB throw
  if (user == null)
    return unauthorised(res, `Invalid admin with id ${userID.unwrap()}`)

  const handlerFn =
    handler._t === "AdminHandler"
      ? handler.fn(user, paramsResult.value)
      : handler.fn(user, paramsResult.value, req)

  return handlerFn
    .then((result) =>
      result._t === "Right"
        ? ok200(res, result.value)
        : err400(res, result.error),
    )
    .catch((error) =>
      internalErr500(
        res,
        error,
        internalErrMessage("Handler Uncaught Exception", req.query, error),
      ),
    )
}

function decodeParams<UrlParams, RequestBody>(
  req: Express.Request,
  urlDecoder: JD.Decoder<UrlParams>,
  bodyDecoder: JD.Decoder<RequestBody>,
): Either<Annotation, UrlParams & RequestBody> {
  const urlResult = fromDecodeResult(
    urlDecoder.decode({ ...req.query, ...req.params }),
  )
  if (urlResult._t === "Left") return left(urlResult.error)

  const bodyResult = fromDecodeResult(bodyDecoder.decode(req.body))
  if (bodyResult._t === "Left") return left(bodyResult.error)

  return right({ ...urlResult.value, ...bodyResult.value })
}

function decodeUrlParams<UrlParams>(
  req: Express.Request,
  urlDecoder: JD.Decoder<UrlParams>,
): Either<Annotation, UrlParams> {
  const urlResult = fromDecodeResult(
    urlDecoder.decode({ ...req.query, ...req.params }),
  )
  if (urlResult._t === "Left") return left(urlResult.error)

  return right(urlResult.value)
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

function decoderErrorMessage<P>(params: P, error: Annotation): string {
  return internalErrMessage(
    "Params Decoder Failed",
    params,
    JD.formatInline(error),
  )
}

function internalErrMessage<E, P>(title: string, params: P, error: E): string {
  const errorMessages = [
    title,
    "Params: " + JSON.stringify(params),
    "Error: " + String(error),
  ]
  return errorMessages.join("\n")
}
