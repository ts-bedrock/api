import handler from "../../../src/handler/user/list"
import { fromRight } from "../../either"
import { createUser } from "../../fixture"
import { fromJust } from "../../maybe"
import { createPositiveInt } from "../../../../core/data/PositiveInt"

describe("handler/user/list", () => {
  test("get users success", async () => {
    const apple = await createUser("apple@gmail.com")
    const banana = await createUser("banana@gmail.com")
    const orange = await createUser("orange@gmail.com")

    const [orange_, banana_, apple_] = await handler(apple, {
      limit: fromJust(createPositiveInt(10)),
      lastID: null,
    }).then(fromRight)
    expect(orange_.id.unwrap()).toEqual(orange.id.unwrap())
    expect(banana_.id.unwrap()).toEqual(banana.id.unwrap())
    expect(apple_.id.unwrap()).toEqual(apple.id.unwrap())

    const [orange__, banana__] = await handler(apple, {
      limit: fromJust(createPositiveInt(2)),
      lastID: null,
    }).then(fromRight)
    expect(orange__.id.unwrap()).toEqual(orange.id.unwrap())
    expect(banana__.id.unwrap()).toEqual(banana.id.unwrap())

    const [apple___] = await handler(apple, {
      limit: fromJust(createPositiveInt(2)),
      lastID: banana__.id,
    }).then(fromRight)
    expect(apple___.id.unwrap()).toEqual(apple.id.unwrap())
  })
})
