import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
export const blogRouter = router({
  getBlogs: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        index: z.number(),
        size: z.number(),
        published: z.boolean(),
        searchData: z.string().optional(),
        orderBy: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId, index, size, orderBy, searchData, published } = input;

      try {
        const blogs = userId
          ? await ctx.prisma.blog.findMany({
              where: {
                userId: userId,
              },
              select: {
                id: true,
                title: true,
                user: true,
                views: true,
                ups: true,
                downs: true,
                description: true,
                firstPicture: true,
                createTime: true,
                published: true,
                tags: true,
                type: true,
              },
              orderBy: {
                [orderBy]: "desc",
              },
            })
          : await ctx.prisma.blog.findMany({
              skip: (index - 1) * size,
              take: size,
              where: {
                published: published,
                userId: userId,
                OR: [
                  {
                    title: {
                      contains: searchData,
                    },
                  },
                  {
                    user: {
                      username: {
                        contains: searchData,
                      },
                    },
                  },
                  {
                    type: {
                      name: {
                        contains: searchData,
                      },
                    },
                  },
                  {
                    tags: {
                      some: {
                        name: {
                          contains: searchData,
                        },
                      },
                    },
                  },
                ],
              },
              select: {
                id: true,
                title: true,
                user: true,
                views: true,
                ups: true,
                downs: true,
                description: true,
                firstPicture: true,
                published: true,
                createTime: true,
                tags: true,
                type: true,
              },
              orderBy: {
                [orderBy]: "desc",
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
  getAllBlogsNum: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      const count = ctx.prisma.blog.count({
        where: {
          userId,
        },
      });
      return count;
    }),
  getBlogById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const blog = ctx.prisma.blog.findFirst({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            title: true,
            user: true,
            content: true,
            views: true,
            ups: true,
            downs: true,
            description: true,
            firstPicture: true,
            createTime: true,
            tags: true,
            type: true,
          },
        });
        return blog;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "服务器逻辑错误",
        });
      }
    }),
  getBlogIds: publicProcedure.query(async ({ ctx }) => {
    try {
      const ids = await ctx.prisma.blog.findMany({
        select: {
          id: true,
        },
      });
      return ids;
    } catch (error) {
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
        typeId: z.string(),
        tags: z.object({ id: z.string(), name: z.string() }).array(),
        firstPicture: z.string().optional(),
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
            content: input.content,
            description: input.description,
            published: input.published,
            firstPicture: input.firstPicture,
            createTime: new Date(),
            tags: {
              connect: input.tags.map((p) => ({ id: p.id })),
            },
            typeId: input.typeId,
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
  updateBlogState: protectedProcedure
    .input(
      z.object({
        blogId: z.string(),
        type: z.string(),
        num: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!["views", "ups", "downs"].includes(input.type)) return;
        const blog = ctx.prisma.blog.update({
          where: {
            id: input.blogId,
          },
          data: {
            [input.type]: input.num,
          },
        });
        return blog;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "server error",
        });
      }
    }),
  updateBlog: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        typeId: z.string(),
        published: z.boolean().optional(),
        tags: z.object({ id: z.string(), name: z.string() }).array(),
        firstPicture: z.string().optional(),
        description: z.string(),
        oldTags: z.object({ id: z.string(), name: z.string() }).array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const blog = await ctx.prisma.blog.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            content: input.content,
            typeId: input.typeId,
            firstPicture: input.firstPicture,
            updateTime: new Date(),
            published: input.published,
            description: input.description,
            tags: {
              disconnect: input.oldTags.map((p) => ({ id: p.id })),
              connect: input.tags.map((p) => ({ id: p.id })),
            },
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
