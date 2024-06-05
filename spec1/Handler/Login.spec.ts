import handler from "../../src/handler/login"
import * as Jwt from "../../src/data/jwt"
import { fromLeft, fromRight } from "../either"
import { createUser } from "../fixture"
import { fromJust } from "../maybe"
import { createEmail } from "../../../core/data/user/Email"
import { createPassword } from "../../../core/data/user/Password"

describe("handler/login", () => {
  test("login success", async () => {
    const email = fromJust(createEmail("user@gmail.com"))
    const password = fromJust(createPassword("123123"))
    await createUser(email.unwrap())

    const { token, user } = await handler({ email, password }).then(fromRight)
    expect(user.id.unwrap()).toEqual(user.id.unwrap())
    expect(user.email.unwrap()).toEqual(email.unwrap())

    const payload = await Jwt.verify(token).then(fromRight)
    expect(payload.userID.unwrap()).toEqual(user.id.unwrap())
  })

  test("login error", async () => {
    const email = fromJust(createEmail("user@gmail.com"))
    const password = fromJust(createPassword("1231234"))

    const userNotFound = await handler({ email, password }).then(fromLeft)
    expect(userNotFound).toEqual("USER_NOT_FOUND")

    await createUser(email.unwrap())

    const invalidPassword = await handler({ email, password }).then(fromLeft)
    expect(invalidPassword).toEqual("INVALID_PASSWORD")
  })
})
