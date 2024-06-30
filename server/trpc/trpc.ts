import { initTRPC } from "@trpc/server";
import type { AppContext } from "~/server/trpc/app-context";

const { procedure, middleware, router } = initTRPC.context<AppContext>().create();

export { procedure, middleware, router };
