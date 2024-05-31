import express, { json } from "express"
import cors from "cors"
import * as Login from "../../core/api/Login"
import login from "./handler/login"
import * as GetUsers from "../../core/api/GetUsers"
import getUsers from "./handler/getUsers"
import { authApi, publicApi } from "./data/handler"

const app = express()
app.use(cors())

// Set use json for all requests but request must have content-type application/json
// Recommended by ExpressJS
app.use(json({ limit: "100kb", type: "application/json" }))

publicApi(app, Login.contract, login)
authApi(app, GetUsers.contract, getUsers)

export default app
