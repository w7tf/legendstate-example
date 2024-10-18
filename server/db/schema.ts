import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey().notNull(),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  content: text("content").notNull(),
  author: text("author").notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
});
