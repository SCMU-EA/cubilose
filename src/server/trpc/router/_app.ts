// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { userRouter } from "./user";
import { authRouter } from "./auth";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
