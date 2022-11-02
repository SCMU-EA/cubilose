// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { blogRouter } from "./blog";
import { typeRouter } from "./type";
export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  blog: blogRouter,
  type: typeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
