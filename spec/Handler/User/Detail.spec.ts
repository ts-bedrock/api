import handler from "../../../src/Handler/User/Detail"
import { fromLeft, fromRight } from "../../Either"
import { createUser } from "../../Fixture"
import { createUserID } from "../../../../core/App/User"

describe("/Handler/User/Detail", () => {
  test("get user success", async () => {
    const apple = await createUser("apple@gmail.com")
    const banana = await createUser("banana@gmail.com")

    const banana_ = await handler(apple, { userID: banana.id }).then(fromRight)
    expect(banana_.id.unwrap()).toEqual(banana.id.unwrap())
  })

  test("get user error", async () => {
    const apple = await createUser("apple@gmail.com")
    const userID = createUserID()

    const error = await handler(apple, { userID }).then(fromLeft)
    expect(error).toEqual("USER_NOT_FOUND")
  })
})
