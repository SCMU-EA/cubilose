import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
export const blogRouter = router({
  getBlogs: protectedProcedure.query(async ({ ctx }) => {
    try {
      const blogs = await ctx.prisma.blog.findMany({
        where: {
          published: true,
        },
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
  infinitePost: protectedProcedure
    .input(
      z.object({
        pageSize: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.pageSize ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.blog.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createTime: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
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

        const blog = await ctx.prisma.blog.create({
          data: {
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
        const blog = await ctx.prisma.blog.delete({
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
  createDraftBlog: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
      try {
        const blog = await ctx.prisma.blog.create({
          data: {
            title: input.title,
            content: input.content,
            userId: user.id,
            published: input.published,
          },
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
