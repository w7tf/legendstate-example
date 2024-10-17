import { eq, gt } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { posts } from "../db/schema";
import { publicProcedure, router } from "../trpc";

export const postRouter = router({
  list: publicProcedure
    .input(z.object({ lastSync: z.number().optional() }))
    .query(async ({ input }) => {
      const { lastSync } = input;

      return await db
        .select()
        .from(posts)
        .where(lastSync ? gt(posts.updatedAt, lastSync) : undefined);
    }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        author: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const values = { ...input, createdAt: undefined, updatedAt: undefined };
      const data = await db.insert(posts).values(values).returning();
      return data[0];
    }),
  update: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        author: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const values = { ...input, createdAt: undefined, updatedAt: undefined };
      await db.update(posts).set(values).where(eq(posts.id, input.id));
    }),
});
