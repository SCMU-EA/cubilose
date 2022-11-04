import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import cuid from "cuid";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
export const blogRouter = router({
  getBlogs: protectedProcedure.query(async ({ ctx }) => {
    try {
      const blogs = await ctx.prisma.blog.findMany({
        select: {
          id: true,
          title: true,
          user: true,
          views: true,
          description: true,
          firstPicture: true,
          tags: true,
          type: true,
        },
      });
      return blogs;
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
        tags: z.object({ id: z.string(), name: z.string() }).array(),
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
            tags: {
              connect: input.tags.map((p) => ({ id: p.id })),
            },
            typeId: input.type,
          },
        });

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
