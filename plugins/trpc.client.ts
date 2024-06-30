import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client";
import type { AppRouter } from "~/server/trpc/app-router";

export default defineNuxtPlugin({
  name: "client",
  async setup() {
    const headers = useRequestHeaders();
    const client = createTRPCNuxtClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          headers() {
            return {
              ...headers,
            };
          },
        }),
      ],
    });
    return {
      provide: {
        client,
      },
    };
  },
});
