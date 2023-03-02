import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const videoClassRouter = router({
  addVideoClass: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const videoClass = await ctx.prisma.videoClass.create({
          data: {
            name: input.name,
          },
        });
        return videoClass;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  getAllVideoClasses: protectedProcedure.query(async ({ ctx }) => {
    try {
      const videoClasses = await ctx.prisma.videoClass.findMany();
      return videoClasses;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "internal server error",
      });
    }
  }),
  getVideoClassById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const videoClass = await ctx.prisma.videoClass.findUnique({
          where: {
            id: input.id,
          },
        });
        return videoClass;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  updateVideoClass: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const videoClass = await ctx.prisma.videoClass.update({
          where: { id: input.id },
          data: { name: input.name },
        });
        return videoClass;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  // createUser: publicProcedure.mutation()
});
