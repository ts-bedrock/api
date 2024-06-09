import { Express } from "express"
import * as UserList from "../../../core/Api/User/List"
import userList from "../Handler/User/List"
import * as UserDetail from "../../../core/Api/User/Detail"
import userDetail from "../Handler/User/Detail"
import { authGetApi } from "../Data/Handler"

export default function (expressApi: Express): void {
  authGetApi(expressApi, UserList.contract, userList)
  authGetApi(expressApi, UserDetail.contract, userDetail)
}
