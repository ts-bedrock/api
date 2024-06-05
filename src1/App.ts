import express, { json } from "express"
import cors from "cors"
import * as Login from "../../core/api/Login"
import login from "./handler/login"
import * as Profile from "../../core/api/Profile"
import profile from "./handler/profile"
import * as UserList from "../../core/api/User/List"
import userList from "./handler/user/list"
import * as UserDetail from "../../core/api/User/Detail"
import userDetail from "./handler/user/detail"
import { authGetApi, publicPostApi } from "./data/handler"

const app = express()
app.use(cors())

// Set use json for all requests but request must have content-type application/json
// Recommended by ExpressJS
app.use(json({ limit: "100kb", type: "application/json" }))

publicPostApi(app, Login.contract, login)
authGetApi(app, Profile.contract, profile)
authGetApi(app, UserList.contract, userList)
authGetApi(app, UserDetail.contract, userDetail)

export default app
