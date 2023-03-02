import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const videoRouter = router({
  addVideo: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        href: z.string(),
        firstPicture: z.string(),
        ups: z.number(),
        videoClassId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const video = await ctx.prisma.video.create({
          data: input,
        });
        return video;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  getAllVideos: protectedProcedure.query(async ({ ctx }) => {
    try {
      const videos = await ctx.prisma.video.findMany();
      return videos;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "internal server error",
      });
    }
  }),
  getVideoById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const video = await ctx.prisma.video.findUnique({
          where: {
            id: input.id,
          },
        });
        return video;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  updateVideo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        href: z.string().optional(),
        firstPicture: z.string().optional(),
        ups: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const video = await ctx.prisma.video.update({
          where: { id: input.id },
          data: input,
        });
        return video;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
});
