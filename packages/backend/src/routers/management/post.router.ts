import z from "zod";
import { PostSchema } from "../../schemas/Post.schema";
import { dbContext } from "../../utils/prisma";
import { RequiredString } from "../../utils/ZodUtils";
import { AddPostSchema } from "../../schemas/AddPost.schema";
import { PaginationSchema } from "../../schemas/Pagination.schema";
import { APIResponseSchema } from "../../schemas/APIResponse.schema";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, trpcRouter } from "../router";
import axios from "axios";
import { TypeAuth0User } from "../../schemas/Auth0User.schema";

export const PostRouter = trpcRouter.router({
  all: protectedProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/management/post.all",
        tags: ["post"],
      },
    })
    .input(z.void())
    .output(APIResponseSchema(z.array(PostSchema)))
    .query(async (opt) => {
      const data = await dbContext.post.findMany({
        include: {
          PostCurrentDetail: true,
          PostImage: true,
          PostType: true,
          PostFeature: true,
        },
      });

      return await APIResponseSchema(z.array(PostSchema)).parseAsync({
        data,
      });
    }),
  byPage: protectedProcedure
    // .meta({
    //   /* 👉 */ openapi: { method: "GET", path: "/management/post.byPage", tags: ["post"]  },
    // })
    .input(PaginationSchema)
    .output(APIResponseSchema(z.array(PostSchema)))
    .query(async ({ input }) => {
      const page_index = input.paging.page_index ?? 1;
      const page_size = input.paging.page_size ?? 10;

      const [data, row_count] = await dbContext.$transaction([
        dbContext.post.findMany({
          skip: page_index,
          take: page_size,
          include: {
            PostCurrentDetail: true,
            PostImage: true,
            PostType: true,
            PostFeature: true,
          },
        }),
        dbContext.post.count(),
      ]);

      return await APIResponseSchema(z.array(PostSchema)).parseAsync({
        data,
        paging: {
          page_index,
          page_size,
          row_count,
        },
      });
    }),
  byId: protectedProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/management/post.byId",
        tags: ["post"],
      },
    })
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    .output(APIResponseSchema(PostSchema.nullable()))
    .query(async ({ input }) => {
      const data = await dbContext.post.findFirst({
        where: {
          Id: input.Id,
        },
        include: {
          PostCurrentDetail: true,
          PostImage: true,
          PostType: true,
          PostFeature: true,
        },
      });

      return await APIResponseSchema(PostSchema.nullable()).parseAsync({
        data,
      });
    }),
  publish: protectedProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "POST",
        path: "/management/post.publish",
        tags: ["post"],
      },
    })
    .input(AddPostSchema)
    .output(
      APIResponseSchema(
        PostSchema.omit({
          PostCurrentDetail: true,
          PostFeature: true,
          PostImage: true,
        }).nullable()
      )
    )
    .mutation(
      async ({
        ctx,
        input: { PostCurrentDetail, PostFeature, PostImage, ...rest },
      }) => {
        if ((await ctx).userId == null)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: ``,
          });

        const response = await axios<TypeAuth0User>({
          url: `${(await ctx).domain}api/v2/user/${(await ctx).userId}`,
          method: "GET",
          params: {
            search_engine: "v3",
          },
          headers: {
            Authorization: `Bearer ${(await ctx).management_token}`,
          },
        });

        const user = response?.data;

        if (user == null)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: ``,
          });

        const result = await dbContext.post.create({
          data: {
            ...rest,
            UserId: (await ctx).userId ?? "",
            User_Email: user.email,
            User_EmailVerified: user.email_verified,
            User_Name: user.name,
            User_Username: user.username,
            User_PhoneNumber: user.phone_number,
            User_PhoneVerified: user.phone_verified,
            User_Picture: user.picture,
            PostCurrentDetail: {
              // connectOrCreate: PostCurrentDetail?.map((item) => ({
              //   where: {
              //     Id: item.Id,
              //   },
              //   create: item,
              // })),
              createMany: {
                data: PostCurrentDetail ?? [],
              },
            },
            PostFeature: {
              // connectOrCreate: PostFeature?.map((item) => ({
              //   where: {
              //     Id: item.Id,
              //   },
              //   create: item,
              // })),
              createMany: {
                data: PostFeature ?? [],
              },
            },
            PostImage: {
              // connectOrCreate: PostImage?.map((item) => ({
              //   where: {
              //     Id: item.Id,
              //   },
              //   create: item,
              // })),
              createMany: {
                data: PostImage ?? [],
              },
            },
          },
        });

        return await APIResponseSchema(
          PostSchema.omit({
            PostCurrentDetail: true,
            PostFeature: true,
            PostImage: true,
          }).nullable()
        ).parseAsync({ data: result });
      }
    ),
  update: protectedProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "PUT",
        path: "/management/post.update",
        tags: ["post"],
      },
    })
    .input(PostSchema)
    .output(
      APIResponseSchema(
        PostSchema.omit({
          PostCurrentDetail: true,
          PostFeature: true,
          PostImage: true,
        }).nullable()
      )
    )
    .mutation(
      async ({
        ctx,
        input: { Id, PostCurrentDetail, PostFeature, PostImage, ...rest },
      }) => {
        //if (ctx.userId == null) return null;

        const result = await dbContext.post.update({
          where: {
            Id,
          },
          data: {
            ...rest,
            PostCurrentDetail: {
              connectOrCreate: PostCurrentDetail?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
            PostFeature: {
              connectOrCreate: PostFeature?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
            PostImage: {
              connectOrCreate: PostImage?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
          },
        });

        return await APIResponseSchema(
          PostSchema.omit({
            PostCurrentDetail: true,
            PostFeature: true,
            PostImage: true,
          }).nullable()
        ).parseAsync({ data: result });
      }
    ),
});
