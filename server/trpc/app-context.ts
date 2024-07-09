import type { inferAsyncReturnType } from "@trpc/server";
import type { H3Event } from "h3";
import investor from "~/server/utils/investor";

export const createContext = async (_event: H3Event) => {
  return {
    investor,
  };
};

export type AppContext = inferAsyncReturnType<typeof createContext>;
