import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const commentRouter = router({
  allComments: publicProcedure
    .input(
      z.object({
        type: z.string(),
        hostId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { type, hostId } = input;
      try {
        if (type === "blog") {
          const comments = await ctx.prisma.comment.findMany({
            where: {
              blogId: hostId,
            },
            include: {
              user: true,
            },
            orderBy: {
              ups: "desc",
            },
          });
          return comments;
        } else {
          const comments = await ctx.prisma.comment.findMany({
            where: {
              dynamicId: hostId,
            },
            include: {
              user: true,
            },
            orderBy: {
              ups: "desc",
            },
          });
          return comments;
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        hostId: z.string(),
        type: z.string(),
        parentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { content, hostId, type, parentId } = input;

      try {
        if (type === "blog") {
          const comment = await ctx.prisma.comment.create({
            data: {
              content,
              blog: {
                connect: { id: hostId },
              },
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              ...(parentId && {
                parent: {
                  connect: {
                    id: parentId,
                  },
                },
              }),
            },
          });
          return comment;
        } else if (type === "dynamic") {
          const comment = await ctx.prisma.comment.create({
            data: {
              content,
              dynamic: {
                connect: { id: hostId },
              },
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              ...(parentId && {
                parent: {
                  connect: {
                    id: parentId,
                  },
                },
              }),
            },
          });
          return comment;
        }
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
  updateStatus: protectedProcedure
    .input(z.object({ ups: z.number(), commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { ups, commentId } = input;
      try {
        const comment = ctx.prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            ups: ups,
          },
        });
        return comment;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = ctx.prisma.comment.delete({
          where: {
            id: input,
          },
        });
        return comment;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
});
