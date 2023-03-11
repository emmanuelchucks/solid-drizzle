import { drizzle } from "drizzle-orm/mysql2"
import { migrate } from "drizzle-orm/mysql2/migrator"
import { createPool } from "mysql2/promise"

const connection = createPool({
  host: "localhost",
  user: "root",
  database: "drizzle-demo",
  multipleStatements: true,
})

const db = drizzle(connection)
await migrate(db, { migrationsFolder: "./src/db/migrations" })
process.exit(0)
