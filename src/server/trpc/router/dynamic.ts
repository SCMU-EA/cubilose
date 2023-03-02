import { number, string, z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const dynamicRouter = router({
  getDynamics: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        index: z.number(),
        size: z.number(),
        searchData: z.string().optional(),
        orderBy: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, index, size, orderBy, searchData } = input;
      try {
        const dynamics = ctx.prisma.dynamic.findMany({
          skip: (index - 1) * size,
          take: size,
          where: {
            userId: userId,
            OR: [
              {
                user: {
                  username: {
                    contains: searchData,
                  },
                },
              },
              {
                content: {
                  contains: searchData,
                },
              },
            ],
          },
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            [orderBy]: "desc",
          },
        });
        return dynamics;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "服务器错误",
        });
      }
    }),
  addDynamic: protectedProcedure
    .input(z.object({ content: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { userId, content } = input;
        const now = new Date();
        const dynamic = ctx.prisma.dynamic.create({
          data: {
            content: content,
            userId: userId,
            createTime: now,
            ups: 0,
          },
        });
        return dynamic;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "服务器错误",
        });
      }
    }),
  changeStatus: protectedProcedure
    .input(z.object({ ups: z.number(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { ups, id } = input;
      try {
        const dynamic = ctx.prisma.dynamic.update({
          where: {
            id: id,
          },
          data: {
            ups: ups,
          },
        });
        return dynamic;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "服务器错误",
        });
      }
    }),
});
