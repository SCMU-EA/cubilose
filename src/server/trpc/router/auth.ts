import { router, publicProcedure, protectedProcedure } from "../trpc";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { z } from "zod";
import * as trpc from "@trpc/server";
export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  getUser: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        select: {
          email: true,
          password: true,
        },
      });
      if (!user || user.password !== input.password) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "User not found or password error",
        });
      }
      return user;
    }),
  registerUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
        username: z.string(),
        password: z.string(),
        description: z.string(),
        avatar: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        select: {
          email: true,
          password: true,
          username: true,
        },
      });
      if (user?.email && (user?.password === null || user?.username === null)) {
        const result = await ctx.prisma.user.update({
          where: { email: user.email },
          data: input,
        });
        return result;
      }

      try {
        const user = await ctx.prisma.user.create({
          data: input,
        });
        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
