import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./spec/JestSetup.ts"],
  roots: ["src", "spec"],
}

export default config
