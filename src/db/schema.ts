import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/mysql-core"

export const posts = mysqlTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: mysqlEnum("type", ["weekly", "monthly"]).notNull().default("weekly"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const comments = mysqlTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    postId: int("post_id").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (comments) => ({
    postIdIdx: index("post_id_idx").on(comments.postId),
  })
)
