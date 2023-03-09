import { connect } from "@planetscale/database"
import { drizzle } from "drizzle-orm/planetscale-serverless"

declare global {
  interface Env {
    DATABASE_URL: string
  }
}

export function db(env: Env) {
  const connection = connect({
    url: env.DATABASE_URL,
  })
  return drizzle(connection)
}
