import z from "zod";
import { dbContext } from "../utils/prisma.js";
import { publicProcedure, trpcRouter } from "./router.js";
import { OptionalString, RequiredString } from "../utils/ZodUtils.js";

export const PublicRouter = trpcRouter.router({
  topPost: publicProcedure
    .input(z.void())
    //.output(APIResponseSchema(z.array(PostSchema)))
    .query(async () => {
      const data = await dbContext.post.findMany({
        take: 5,
        include: {
          PostCurrentDetail: {
            include: {
              PostDetail: true,
            },
          },
          PostImage: true,
          PostType: true,
          PostFeature: true,
          PostStats: {
            orderBy: {
              ViewCount: "desc",
            },
          },
        },
      });

      return {
        data,
      };
      // return await APIResponseSchema(z.array(PostSchema)).parseAsync({
      //   data,
      // });
    }),
  topPosts: publicProcedure.input(z.void()).query(async () => {
    const data = await dbContext.post.findMany({
      take: 5,
      include: {
        PostImage: true,
        PostFeature: true,
        PostType: true,
        Auth0Profile: true,
        PostCurrentDetail: true,
        PostStats: {
          orderBy: {
            ViewCount: "desc",
          },
        },
      },
    });

    return { data };
  }),
  getPostById: publicProcedure
    .input(
      z.object({
        id: RequiredString,
      })
    )
    .query(async ({ input }) => {
      const today = new Date();

      const [data, stats] = await dbContext.$transaction([
        dbContext.post.findFirst({
          where: {
            Id: input.id,
          },
          include: {
            PostCurrentDetail: {
              include: {
                PostDetail: true,
              },
            },
            PostImage: true,
            PostType: true,
            PostFeature: true,
            PostStats: true,
            Auth0Profile: true,
          },
        }),
        dbContext.postStats.upsert({
          create: {
            ViewCount: 1,
            PostId: input.id ?? "00000000-0000-0000-0000-000000000000",
            CreatedDate: today,
          },
          update: {
            ViewCount: {
              increment: 1,
            },
          },
          where: {
            Id: input.id ?? "00000000-0000-0000-0000-000000000000",
            CreatedDate: {
              lte: today,
            },
            // AND: [
            //   { Id: input.id ?? "00000000-0000-0000-0000-000000000000" },
            //   {
            //     CreatedDate: {
            //       lte: today,
            //     },
            //   },
            // ],
          },
        }),
      ]);

      return {
        data: {
          ...data,
          PostStats: undefined,
          PostStat: stats,
        },
      };
    }),
  searchPosts: publicProcedure
    .input(
      z.object({
        keyword: OptionalString,
      })
    )
    .query(async ({ input }) => {
      const response = await dbContext.post.findMany({
        include: {
          Auth0Profile: true,
          PostImage: true,
          PostFeature: true,
          PostType: true,
          PostCurrentDetail: true,
          PostStats: true,
        },
        where: {
          OR: [
            {
              Title: {
                contains: input.keyword,
              },
            },
            {
              Description: {
                contains: input.keyword,
              },
            },
          ],
        },
        take: 20,
      });

      return { data: response };
    }),
  topBlogs: publicProcedure.input(z.void()).query(async () => {
    const data = await dbContext.blog.findMany({
      take: 5,
      include: {
        BlogImage: true,
        BlogStats: {
          orderBy: {
            ViewCount: "desc",
          },
        },
      },
    });

    return { data };
  }),
  getBlogById: publicProcedure
    .input(
      z.object({
        id: RequiredString,
      })
    )
    .query(async ({ input }) => {
      const today = new Date();
      const [data, stats] = await dbContext.$transaction([
        dbContext.blog.findFirst({
          where: {
            Id: input.id,
          },
          include: {
            BlogImage: true,
            GlobalBlogType: true,
            BlogStats: true,
            Auth0Profile: true,
          },
        }),
        dbContext.blogStats.upsert({
          create: {
            ViewCount: 1,
            BlogId: input.id ?? "00000000-0000-0000-0000-000000000000",
            CreatedDate: today,
          },
          update: {
            ViewCount: {
              increment: 1,
            },
          },
          where: {
            Id: input.id ?? "00000000-0000-0000-0000-000000000000",
            CreatedDate: {
              lte: today,
            },
            // AND: [
            //   { Id: input.id ?? "00000000-0000-0000-0000-000000000000" },
            //   {
            //     CreatedDate: {
            //       lte: today,
            //     },
            //   },
            // ],
          },
        }),
      ]);

      return {
        data: {
          ...data,
          BlogStats: undefined,
          BlogStat: stats,
        },
      };
    }),
  searchBlogs: publicProcedure
    .input(
      z.object({
        keyword: OptionalString,
      })
    )
    //.output(APIResponseSchema(PostSchema))
    .query(async ({ input }) => {
      const response = await dbContext.blog.findMany({
        include: {
          Auth0Profile: true,
          BlogImage: true,
          GlobalBlogType: true,
        },
        where: {
          OR: [
            {
              Title: {
                contains: input.keyword,
              },
            },
            {
              Description: {
                contains: input.keyword,
              },
            },
          ],
        },
        take: 20,
      });

      return { data: response };
    }),
});
