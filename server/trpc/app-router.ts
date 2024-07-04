import User from "~/server/trpc/routes/user";
import Wallet from "~/server/trpc/routes/wallet";
import { router } from "./trpc";

export const appRouter = router({
  User,
  Wallet,
});

export type AppRouter = typeof appRouter;
