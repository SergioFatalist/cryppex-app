import type { inferAsyncReturnType } from "@trpc/server";
import type { H3Event } from "h3";

export const createContext = async (_event: H3Event) => {
  return {};
};

export type AppContext = inferAsyncReturnType<typeof createContext>;
