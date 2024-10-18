import { eq, gt } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { comments, posts } from "../db/schema";
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
      const data = await db.insert(posts).values(input).returning();
      return data[0];
    }),
  update: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        author: z.string(),
        id: z.string(),
        isDeleted: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!input.isDeleted) {
        await db.update(posts).set(input).where(eq(posts.id, input.id));
      }

      if (input.isDeleted) {
        await db.transaction(
          async (tx) => {
            await tx
              .update(posts)
              .set({
                author: "",
                content: "",
                isDeleted: true,
              })
              .where(eq(posts.id, input.id));

            await tx
              .update(comments)
              .set({
                author: "",
                content: "",
                isDeleted: true,
              })
              .where(eq(comments.postId, input.id));
          },
          { behavior: "immediate" }
        );
      }
    }),
});
