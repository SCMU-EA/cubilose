import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const tagRouter = router({
  addTag: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const type = await ctx.prisma.tag.create({
          data: {
            name: input.name,
          },
        });
        return type;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    try {
      const tags = ctx.prisma.tag.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      return tags;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "internal server error",
      });
    }
  }),
  getTagsById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const tags = await ctx.prisma.tag.findMany({
          where: {
            blogs: {
              some: {
                id: input.id,
              },
            },
          },
        });
        return tags;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  updateTag: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const type = await ctx.prisma.tag.update({
          where: { id: input.id },
          data: { name: input.name },
        });
        return type;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  // createUser: publicProcedure.mutation()
});
