import type { AppRouter } from "@examples/minimal-trpc";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      colorMode: "ansi",
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: "http://localhost:3000",
    }),
  ],
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
