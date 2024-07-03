import User from "~/server/trpc/routes/user";
import { router } from "./trpc";

export const appRouter = router({
  User,
});

export type AppRouter = typeof appRouter;
