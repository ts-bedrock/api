import handler from "../../../src/Handler/User/List"
import { fromRight } from "../../Either"
import { createUser } from "../../Fixture"
import { fromJust } from "../../Maybe"
import { createPositiveInt } from "../../../../core/Data/Number/PositiveInt"
import { sleep } from "../../Timer"
import { Nat0, createNat } from "../../../../core/Data/Number/Nat"

describe("/Handler/User/List", () => {
  test("get users success", async () => {
    const apple = await createUser("apple@gmail.com")
    await sleep(1)
    const banana = await createUser("banana@gmail.com")
    await sleep(1)
    const orange = await createUser("orange@gmail.com")

    const [orange_, banana_, apple_] = await handler(apple, {
      limit: fromJust(createPositiveInt(10)),
      offset: Nat0,
    }).then(fromRight)
    expect(orange_.name.unwrap()).toEqual(orange.name.unwrap())
    expect(banana_.name.unwrap()).toEqual(banana.name.unwrap())
    expect(apple_.name.unwrap()).toEqual(apple.name.unwrap())

    const limit = fromJust(createPositiveInt(2))
    const [orange__, banana__] = await handler(apple, {
      limit,
      offset: Nat0,
    }).then(fromRight)
    expect(orange__.name.unwrap()).toEqual(orange.name.unwrap())
    expect(banana__.name.unwrap()).toEqual(banana.name.unwrap())

    const [apple___] = await handler(apple, {
      limit,
      offset: fromJust(createNat(2)),
    }).then(fromRight)
    expect(apple___.name.unwrap()).toEqual(apple.name.unwrap())
  })
})
