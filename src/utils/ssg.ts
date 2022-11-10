import type { appRouter } from "../server/trpc/router/_app";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { prisma } from "../server/db/client";

import superjson from "superjson";
const ssg = createProxySSGHelpers({
  router: appRouter,
  ctx: {},
  transformer: superjson,
});
const;
