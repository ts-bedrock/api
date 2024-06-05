import express, { json } from "express"
import cors from "cors"
import * as Login from "../../core/Api/Login"
import login from "./Handler/Login"
import * as Profile from "../../core/Api/Profile"
import profile from "./Handler/Profile"
import * as UserList from "../../core/Api/User/List"
import userList from "./Handler/User/List"
import * as UserDetail from "../../core/Api/User/Detail"
import userDetail from "./Handler/User/Detail"
import { authGetApi, publicPostApi } from "./Data/Handler"

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
