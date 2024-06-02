import express, { json } from "express"
import cors from "cors"
import * as Login from "../../core/api/Login"
import login from "./handler/login"
import * as GetUsers from "../../core/api/GetUsers"
import getUsers from "./handler/getUsers"
import { authGetApi, publicPostApi } from "./data/handler"

const app = express()
app.use(cors())

// Set use json for all requests but request must have content-type application/json
// Recommended by ExpressJS
app.use(json({ limit: "100kb", type: "application/json" }))

publicPostApi(app, Login.contract, login)
authGetApi(app, GetUsers.contract, getUsers)

export default app
