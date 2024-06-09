import express, { json, Request, Response, NextFunction } from "express"
import cors from "cors"
import { ApiError, Err400 } from "../../core/Data/Api"
import { authGetApi, publicPostApi } from "./Data/Handler"
import * as Login from "../../core/Api/Login"
import login from "./Handler/Login"
import * as Profile from "../../core/Api/Profile"
import profile from "./Handler/Profile"
import userApi from "./Api/User"

const expressApi = express()
expressApi.use(cors())

// Set use json for all requests but request must have content-type application/json
// Recommended by ExpressJS
expressApi.use(json({ limit: "100kb", type: "application/json" }))

// To support custom response for json limit
expressApi.use(
  (
    err: { type?: "entity.too.large" | string }, // Find more error type here https://github.com/expressjs/body-parser?tab=readme-ov-file#errors
    _req: Request,
    res: Response<Err400<ApiError>>,
    _next: NextFunction,
  ) => {
    if (err != null && err.type === "entity.too.large") {
      return res.status(400).json({ _t: "Err", code: "PAYLOAD_TOO_LARGE" })
    }
  },
)

publicPostApi(expressApi, Login.contract, login)
authGetApi(expressApi, Profile.contract, profile)

userApi(expressApi)

export default expressApi
