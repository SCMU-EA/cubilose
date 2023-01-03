import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { userRelation } from "../../../types/userRelation";
import { UserRelation } from "@prisma/client";
export const userRelationRouter = router({
  getRelations: publicProcedure
    .input(z.object({ userId: z.string(), type: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId, type } = input;
      try {
        const relations =
          type === "fans"
            ? ctx.prisma.userRelation.findUnique({
                where: {
                  userId,
                },
                select: {
                  fans: true,
                },
              })
            : ctx.prisma.userRelation.findUnique({
                where: {
                  userId,
                },
                select: {
                  followings: true,
                },
              });
        return relations;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),

  createRelations: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const data = ctx.prisma.userRelation.create({
          data: {
            userId: input.userId,
            followings: "[]",
            fans: "[]",
          },
        });
        return data;
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
        operate: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, following, fan, operate } = input;
      const relation: UserRelation = (await ctx.prisma.userRelation.findUnique({
        where: {
          userId,
        },
        select: {
          fans: true,
          followings: true,
        },
      })) as UserRelation;

      if (following) {
        if (operate === "add") {
          if (relation.followings.includes(following)) return;
          relation.followings =
            relation.followings === "[]"
              ? relation.followings.replace("]", '"' + following + '"]')
              : relation.followings.replace("]", ',"' + following + '"]');
        } else {
          relation.followings = relation.followings.replace(
            ',"' + following + '"',
            "",
          );
          relation.followings = relation.followings.replace(
            '"' + following + '",',
            "",
          );
        }
      } else if (fan) {
        if (operate === "add") {
          if (relation.fans.includes(fan)) return;

          relation.fans =
            relation.fans === "[]"
              ? relation.fans.replace("]", '"' + fan + '"]')
              : relation.fans.replace("]", ',"' + fan + '"]');
        } else {
          relation.fans = relation.fans.replace(',"' + fan + '"', "");
          relation.fans = relation.fans.replace('"' + fan + '",', "");
        }
      }

      try {
        const data = await ctx.prisma.userRelation.update({
          where: {
            userId,
          },
          data: {
            fans: relation.fans,
            followings: relation.followings,
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
