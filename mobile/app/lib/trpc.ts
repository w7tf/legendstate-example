import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@examples/minimal-trpc";

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
    }),
  ],
});
