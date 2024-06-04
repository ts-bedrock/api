import handler from "../../../src/handler/user/detail"
import { fromLeft, fromRight } from "../../either"
import { createUser } from "../../fixture"
import { fromJust } from "../../maybe"
import { createPositiveInt } from "../../../../core/data/PositiveInt"

describe("handler/user/detail", () => {
  test("get user success", async () => {
    const apple = await createUser("apple@gmail.com")
    const banana = await createUser("banana@gmail.com")

    const banana_ = await handler(apple, { userID: banana.id }).then(fromRight)
    expect(banana_.id.unwrap()).toEqual(banana.id.unwrap())
  })

  test("get user error", async () => {
    const apple = await createUser("apple@gmail.com")
    const userID = fromJust(createPositiveInt(1000000))

    const error = await handler(apple, { userID }).then(fromLeft)
    expect(error).toEqual("USER_NOT_FOUND")
  })
})
