import { eq, gt } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { comments } from "../db/schema";
import { publicProcedure, router } from "../trpc";

export const commentsRouter = router({
  list: publicProcedure
    .input(z.object({ lastSync: z.number().optional() }))
    .query(async ({ input }) => {
      const { lastSync } = input;

      return await db
        .select()
        .from(comments)
        .where(lastSync ? gt(comments.updatedAt, lastSync) : undefined);
    }),
  create: publicProcedure
    .input(
      z.object({
        content: z.string(),
        author: z.string(),
        id: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const values = { ...input, createdAt: undefined, updatedAt: undefined };
      const data = await db.insert(comments).values(values).returning();
      return data[0];
    }),
  update: publicProcedure
    .input(
      z.object({
        content: z.string(),
        author: z.string(),
        id: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const values = { ...input, createdAt: undefined, updatedAt: undefined };
      const data = await db
        .update(comments)
        .set(values)
        .where(eq(comments.id, values.id))
        .returning();
      return data[0];
    }),
});
