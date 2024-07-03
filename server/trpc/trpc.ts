import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { AppContext } from "~/server/trpc/app-context";

const { procedure, middleware, router } = initTRPC.context<AppContext>().create({
  transformer: superjson,
});

export { procedure, middleware, router };
