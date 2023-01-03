// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { blogRouter } from "./blog";
import { typeRouter } from "./type";
import { tagRouter } from "./tag";
import { commentRouter } from "./comment";
import { dynamicRouter } from "./dynamic";
import { toolClassRouter } from "./toolClass";
import { toolRouter } from "./tool";
import { userRelationRouter } from "./userRelation";
export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  blog: blogRouter,
  type: typeRouter,
  tag: tagRouter,
  comment: commentRouter,
  dynamic: dynamicRouter,
  toolClass: toolClassRouter,
  tool: toolRouter,
  userRelation: userRelationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
