import z from "zod";
import { dbContext } from "../utils/prisma.js";
import { publicProcedure, trpcRouter } from "./router.js";
import { OptionalString, RequiredString } from "../utils/ZodUtils.js";
import { TRPCError } from "@trpc/server";
import { RemoteAuth0UserSchema } from "../schemas/RemoteAuth0User.schema.js";

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

      const postStat = await dbContext.postStats.findFirst({
        where: {
          PostId: input.id ?? "00000000-0000-0000-0000-000000000000",
          CreatedDate: {
            gte: new Date(today.toISOString().slice(0, 10)), // Greater than or equal to the start of today
            lt: new Date(today.toISOString().slice(0, 10) + "T23:59:59"), // Less than the end of today
          },
        },
      });

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
            Id: postStat?.Id ?? "00000000-0000-0000-0000-000000000000",
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

      const blogStat = await dbContext.blogStats.findFirst({
        where: {
          BlogId: input.id ?? "00000000-0000-0000-0000-000000000000",
          CreatedDate: {
            gte: new Date(today.toISOString().slice(0, 10)), // Greater than or equal to the start of today
            lt: new Date(today.toISOString().slice(0, 10) + "T23:59:59"), // Less than the end of today
          },
        },
      });

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
            //Id: input.id ?? "00000000-0000-0000-0000-000000000000",
            Id: blogStat?.Id ?? "00000000-0000-0000-0000-000000000000",
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
  addUserAfterRegistration: publicProcedure
    .input(
      z.object({
        user: RemoteAuth0UserSchema,
        client_secret: RequiredString,
      })
    )
    .mutation(
      async ({
        input: {
          user: {
            user_id,
            username,
            created_at,
            updated_at,
            last_login,
            ...userInfo
          },
          client_secret,
        },
      }) => {
        if (process.env.AUTH0_MANAGEMENT_CLIENT_SECRET !== client_secret)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: ``,
          });

        const response = await dbContext.auth0Profile.upsert({
          create: {
            user_id,
            ...userInfo,
            user_name: username,
            last_login: last_login ? new Date(last_login) : undefined,
          },
          update: { ...userInfo, user_name: username },
          where: {
            user_id,
          },
        });

        return {
          data: response,
        };
      }
    ),
});
