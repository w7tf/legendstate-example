import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { commentsRouter } from "./routes/comments";
import { postRouter } from "./routes/posts";
import { publicProcedure, router } from "./trpc";

const appRouter = router({
  ping: publicProcedure.query(async () => {
    return "PONG";
  }),
  posts: postRouter,
  comments: commentsRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);

console.log("Server started on http://localhost:3000");
