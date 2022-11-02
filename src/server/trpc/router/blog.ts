import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import cuid from "cuid";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
export const blogRouter = router({
  getBlogs: protectedProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.prisma.blog.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          firstPicture: true,
        },
      });
      return users;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "服务器逻辑错误",
      });
    }
  }),
  createBlog: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        published: z.boolean(),
        type: z.string(),
        tags: z.string().array().optional(),
        firstPicture: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { user } = ctx.session;

        const blogId: string = cuid();

        const blog = await ctx.prisma.blog.create({
          data: {
            id: blogId,
            userId: user.id,
            title: input.title,
            content: input.title,
            description: input.description,
            published: input.published,
            firstPicture: input.firstPicture,
            typeId: input.type,
          },
        });

        if (input.tags) {
          for (const tag of input.tags) {
            await ctx.prisma.tag.create({
              data: {
                name: tag,
                blogId: blogId,
              },
            });
          }
        }
        return blog;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "server error",
        });
      }
    }),
  deleteBlog: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const blog = ctx.prisma.blog.delete({
          where: { id: input.id },
        });
        return blog;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "server error",
        });
      }
    }),
});
