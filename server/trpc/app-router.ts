import Investment from "~/server/trpc/routes/investment";
import User from "~/server/trpc/routes/user";
import Wallet from "~/server/trpc/routes/wallet";
import { router } from "./trpc";

export const appRouter = router({
  Investment,
  User,
  Wallet,
});

export type AppRouter = typeof appRouter;
