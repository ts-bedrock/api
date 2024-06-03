import express, { json } from "express"
import cors from "cors"
import * as Login from "../../core/api/Login"
import login from "./handler/login"
import * as Users from "../../core/api/Users"
import users from "./handler/users"
import * as Profile from "../../core/api/Profile"
import profile from "./handler/profile"
import { authGetApi, publicPostApi } from "./data/handler"

const app = express()
app.use(cors())

// Set use json for all requests but request must have content-type application/json
// Recommended by ExpressJS
app.use(json({ limit: "100kb", type: "application/json" }))

publicPostApi(app, Login.contract, login)
authGetApi(app, Users.contract, users)
authGetApi(app, Profile.contract, profile)

export default app
