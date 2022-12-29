import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const toolRouter = router({
  addTool: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        href: z.string(),
        logoUrl: z.string(),
        toolClassId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const tool = await ctx.prisma.tool.create({
          data: input,
        });
        return tool;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  getAllTools: protectedProcedure.query(async ({ ctx }) => {
    try {
      const tools = await ctx.prisma.tool.findMany();
      return tools;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "internal server error",
      });
    }
  }),
  getToolById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const tool = await ctx.prisma.tool.findUnique({
          where: {
            id: input.id,
          },
        });
        return tool;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  updateTool: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        href: z.string().optional(),
        logoUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const tool = await ctx.prisma.tool.update({
          where: { id: input.id },
          data: input,
        });
        return tool;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  // createUser: publicProcedure.mutation()
});
