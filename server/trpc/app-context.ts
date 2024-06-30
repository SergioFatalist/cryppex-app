import type { inferAsyncReturnType } from "@trpc/server";
// import type { H3Event } from "h3";

export const createContext = async () => {
  return {
    bot,
  };
};

export type AppContext = inferAsyncReturnType<typeof createContext>;
