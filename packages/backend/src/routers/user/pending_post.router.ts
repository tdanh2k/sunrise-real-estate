import z from "zod";
import { PendingPostSchema } from "../../schemas/PendingPost.schema";
import { dbContext } from "../../utils/prisma";
import { RequiredString } from "../../utils/ZodUtils";
import { APIResponseSchema } from "../../schemas/APIResponse.schema";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema";
import { protectedProcedure, trpcRouter } from "../router";
import axios from "axios";
import { TypeAuth0User } from "../../schemas/Auth0User.schema";

export const PendingPostRouter = trpcRouter.router({
  byPage: protectedProcedure
    // .meta({
    //   /* 👉 */ openapi: { method: "GET", path: "/user/post.byPage", tags: ["post"]  },
    // })
    .input(PaginationSchema)
    .output(APIResponseSchema(z.array(PendingPostSchema)))
    .query(async ({ ctx, input }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const page_index = input.paging.page_index ?? 1;
      const page_size = input.paging.page_size ?? 10;

      const [data, row_count] = await dbContext.$transaction([
        dbContext.pendingPost.findMany({
          where: {
            UserId: (await ctx).userId,
          },
          skip: page_index,
          take: page_size,
          include: {
            PendingPostCurrentDetail: true,
            PendingPostImage: true,
            PendingPostFeature: true,
          },
        }),
        dbContext.post.count(),
      ]);

      return await APIResponseSchema(z.array(PendingPostSchema)).parseAsync({
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
        path: "/user/pending_post.byId",
        tags: ["pending_post"],
      },
    })
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    .output(APIResponseSchema(PendingPostSchema.nullable()))
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
      return await APIResponseSchema(PendingPostSchema.nullable()).parseAsync({
        data,
      });
    }),
  approve: protectedProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "POST",
        path: "/user/pending_post.approve",
        tags: ["pending_post"],
      },
    })
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    .output(
      APIResponseSchema(
        PendingPostSchema.omit({
          PendingCurrentDetail: true,
          PendingFeature: true,
          PendingPostImage: true,
        }).nullable()
      )
    )
    .mutation(async ({ ctx, input: { Id } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const data = await dbContext.pendingPost.findFirst({
        where: {
          Id,
        },
        include: {
          PendingPostCurrentDetail: true,
          PendingPostFeature: true,
          PendingPostImage: true,
        },
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

      const result = await dbContext.$transaction([
        dbContext.pendingPost.update({
          data: {
            ApprovedBy: (await ctx).userId,
            ApprovedDate: new Date(),
          },
          where: {
            Id,
          },
        }),
        dbContext.post.create({
          data: {
            Idx: data?.Idx,
            Code: data?.Code,
            Title: data?.Title ?? "",
            Description: data?.Description ?? "",
            Address: data?.Address ?? "",
            MapUrl: data?.MapUrl ?? "",
            Price: data?.Price,
            TypeId: data?.TypeId ?? "",
            UserId: data?.UserId ?? (await ctx).userId ?? "",
            User_Email: user.email,
            User_EmailVerified: user.email_verified,
            User_Name: user.name,
            User_Username: user.username,
            User_PhoneNumber: user.phone_number,
            User_PhoneVerified: user.phone_verified,
            User_Picture: user.picture,
            PostCurrentDetail: {
              createMany: {
                data:
                  data?.PendingPostCurrentDetail?.map((item) => ({
                    ...item,
                    PendingPostId: undefined,
                  })) ?? [],
              },
            },
            PostFeature: {
              createMany: {
                data:
                  data?.PendingPostFeature?.map((item) => ({
                    ...item,
                    Description: item.Description ?? "",
                    PendingPostId: undefined,
                  })) ?? [],
              },
            },
            PostImage: {
              createMany: {
                data:
                  data?.PendingPostImage?.map((item) => ({
                    ...item,
                    PendingPostId: undefined,
                  })) ?? [],
              },
            },
          },
        }),
      ]);

      return await APIResponseSchema(
        PendingPostSchema.omit({
          PendingCurrentDetail: true,
          PendingFeature: true,
          PendingPostImage: true,
        }).nullable()
      ).parseAsync({ data });
    }),
  reject: protectedProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "POST",
        path: "/user/pending_post.reject",
        tags: ["pending_post"],
      },
    })
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    .output(
      APIResponseSchema(
        PendingPostSchema.omit({
          PendingCurrentDetail: true,
          PendingFeature: true,
          PendingPostImage: true,
        }).nullable()
      )
    )
    .mutation(async ({ ctx, input: { Id } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const data = await dbContext.pendingPost.findFirst({
        where: {
          Id,
        },
        include: {
          PendingPostCurrentDetail: true,
          PendingPostFeature: true,
          PendingPostImage: true,
        },
      });

      const [, pendingPost] = await dbContext.$transaction([
        dbContext.draftPost.create({
          data: {
            Idx: data?.Idx,
            Code: data?.Code,
            Title: data?.Title ?? "",
            Description: data?.Description ?? "",
            Address: data?.Address ?? "",
            MapUrl: data?.MapUrl ?? "",
            Price: data?.Price,
            TypeId: data?.TypeId ?? "",
            UserId: data?.UserId ?? (await ctx).userId ?? "",
            DraftPostCurrentDetail: {
              createMany: {
                data:
                  data?.PendingPostCurrentDetail?.map((item) => ({
                    ...item,
                    PendingPostId: undefined,
                  })) ?? [],
              },
            },
            DraftPostFeature: {
              createMany: {
                data:
                  data?.PendingPostFeature?.map((item) => ({
                    ...item,
                    Description: item.Description ?? "",
                    PendingPostId: undefined,
                  })) ?? [],
              },
            },
            DraftPostImage: {
              createMany: {
                data:
                  data?.PendingPostImage?.map((item) => ({
                    ...item,
                    PendingPostId: undefined,
                  })) ?? [],
              },
            },
          },
        }),
        dbContext.pendingPost.delete({
          where: {
            Id,
          },
          include: {
            PendingPostCurrentDetail: true,
            PendingPostFeature: true,
            PendingPostImage: true,
          },
        }),
      ]);

      return await APIResponseSchema(
        PendingPostSchema.omit({
          PendingCurrentDetail: true,
          PendingFeature: true,
          PendingPostImage: true,
        }).nullable()
      ).parseAsync({ data: pendingPost });
    }),
});
