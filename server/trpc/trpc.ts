import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { PaginatiedSchema } from "~/server/model/trpc";
import type { AppContext } from "~/server/trpc/app-context";

const { procedure, middleware, router } = initTRPC.context<AppContext>().create({
  transformer: superjson,
});

const paginated = procedure.input(PaginatiedSchema).use((opts) => opts.next());

export { procedure, paginated, middleware, router };
