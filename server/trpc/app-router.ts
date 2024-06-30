import { router } from "./trpc";
import validation from "~/server/trpc/routes/validation";

export const appRouter = router({
  validation,
});

export type AppRouter = typeof appRouter;