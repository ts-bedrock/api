import { Maybe, throwIfNothing } from "../../core/data/Maybe"

export function fromJust<T>(m: Maybe<T>): T {
  return throwIfNothing(m, `${m} should not be Nothing`)
}
