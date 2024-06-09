import handler from "../../src/Handler/Login"
import * as Jwt from "../../src/Data/Jwt"
import { fromLeft, fromRight } from "../Either"
import { createUser } from "../Fixture"
import { fromJust } from "../Maybe"
import { createEmail } from "../../../core/Data/User/Email"
import { createPassword } from "../../../core/Data/User/Password"

describe("Handler/Login", () => {
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
