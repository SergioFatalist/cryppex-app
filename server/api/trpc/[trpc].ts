import { createNuxtApiHandler } from "trpc-nuxt";
import { createContext } from "~/server/trpc/app-context";
import { appRouter } from "~/server/trpc/app-router";

export default createNuxtApiHandler({
  router: appRouter,
  createContext,
  batching: {
    enabled: true,
  },
});
