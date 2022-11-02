import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const typeRouter = router({
  addType: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const type = await ctx.prisma.type.create({
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
  getAllTypes: protectedProcedure.query(async ({ ctx }) => {
    try {
      const types = await ctx.prisma.type.findMany();
      return types;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "internal server error",
      });
    }
  }),
  updateType: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const type = await ctx.prisma.type.update({
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
