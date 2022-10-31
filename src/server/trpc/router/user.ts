import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  getUserMsg: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findFirst({
          where: {
            email: input.email,
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
