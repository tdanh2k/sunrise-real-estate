import z from "zod";
import { dbContext } from "../utils/prisma";
import { publicProcedure, trpcRouter } from "./router";
import { OptionalString, RequiredString } from "../utils/ZodUtils";

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
    //.output(APIResponseSchema(PostSchema))
    .query(async ({ input }) => {
      const data = await dbContext.post.findFirst({
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
      });

      return {
        data,
      };
      // return await APIResponseSchema(PostSchema).parseAsync({
      //   data,
      // });
    }),
  searchPosts: publicProcedure
    .input(
      z.object({
        keyword: OptionalString,
      })
    )
    //.output(APIResponseSchema(PostSchema))
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
  getBlogById:
    //.output(APIResponseSchema(PostSchema))
    publicProcedure
      .input(
        z.object({
          id: RequiredString,
        })
      )
      .query(async ({ input }) => {
        const data = await dbContext.blog.findFirst({
          where: {
            Id: input.id,
          },
          include: {
            BlogImage: true,
            GlobalBlogType: true,
            BlogStats: true,
            Auth0Profile: true,
          },
        });

        return {
          data,
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
