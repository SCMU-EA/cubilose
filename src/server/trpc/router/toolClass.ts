import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const toolClassRouter = router({
  addtoolClass: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const toolClass = await ctx.prisma.toolClass.create({
          data: {
            name: input.name,
          },
        });
        return toolClass;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  getAlltoolClasses: protectedProcedure.query(async ({ ctx }) => {
    try {
      const toolClasses = await ctx.prisma.toolClass.findMany();
      return toolClasses;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "internal server error",
      });
    }
  }),
  getToolClassById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const toolClass = await ctx.prisma.toolClass.findUnique({
          where: {
            id: input.id,
          },
        });
        return toolClass;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "internal server error",
        });
      }
    }),
  updateToolClass: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const toolClass = await ctx.prisma.toolClass.update({
          where: { id: input.id },
          data: { name: input.name },
        });
        return toolClass;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    }),
  // createUser: publicProcedure.mutation()
});
