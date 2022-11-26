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
            avatar: true,
            description: true,
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
  updateUserMsg: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string(),
        password: z.string(),
        avatar: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = ctx.prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            username: input.username,
            password: input.password,
            description: input.description,
            avatar: input.avatar,
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
});
