import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./spec/jest-setup-database.ts"],
  roots: ["src", "spec"],
}

export default config
