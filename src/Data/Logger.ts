import ENV from "../Env"

export function log(s: unknown): void {
  switch (ENV.APP_ENV) {
    case "test":
      return
    case "development":
      return console.info(s)
    case "production":
      return console.info(s)
  }
}

export function error(s: unknown): void {
  switch (ENV.APP_ENV) {
    case "test":
      return console.error(s)
    case "development":
      return console.error(s)
    case "production":
      return console.error(s)
  }
}

export function fullError(e: Error) {
  return console.error(fullErrorDetail(e))
}

export function fullErrorDetail(e: Error) {
  return {
    name: e.name,
    message: e.message,
    cause: e.cause,
    stack: e.stack?.split("\n"),
  }
}
