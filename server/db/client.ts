import { drizzle } from "drizzle-orm/connect";

export const db = await drizzle("libsql", "file:local.db");
