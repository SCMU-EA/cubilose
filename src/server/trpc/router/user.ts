import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  getUserMsg: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findFirst({
          where: {
            id: input.id,
          },
          select: {
            email: true,
            username: true,
          },
        });
        return user;
      } catch (e) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "user not found",
        });
      }
    }),
  // createUser: publicProcedure.mutation()
});
