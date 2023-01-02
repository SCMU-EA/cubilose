import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { userRelation } from "../../../types/userRelation";
import { UserRelation } from "@prisma/client";
export const userRelationRouter = router({
  getRelations: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const relations = ctx.prisma.userRelation.findUnique({
          where: {
            userId: input.userId,
          },
        });
        return relations;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
  createRelations: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        ctx.prisma.userRelation.create({
          data: {
            userId: input.userId,
            followings: "[]",
            fans: "[]",
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
  updateRelations: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        following: z.string().optional(),
        fan: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, following, fan } = input;
      const relation: UserRelation = (await ctx.prisma.userRelation.findUnique({
        where: {
          userId,
        },
        select: {
          fans: true,
          followings: true,
        },
      })) as UserRelation;
      const { fans, followings } = relation;
      const fansArr = JSON.parse(fans);
      const followingArr = JSON.parse(fans);
      following
        ? followingArr.push(JSON.parse(following))
        : fansArr.push(JSON.parse(fan as string));
      try {
        const data = await ctx.prisma.userRelation.update({
          where: {
            userId,
          },
          data: {
            fans: JSON.stringify(fans),
            followings: JSON.stringify(followings),
          },
        });
        return data;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
