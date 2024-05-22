import { TRPCError } from "@trpc/server";
import z from "zod";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema.js";
import { AddDraftPostSchema } from "../../schemas/AddDraftPost.schema.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { TypePendingPost } from "../../schemas/PendingPost.schema.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { dbContext } from "../../utils/prisma.js";
import { protectedProcedure, trpcRouter } from "../router.js";

export const PendingPostRouter = trpcRouter.router({
  byPage: protectedProcedure
    .input(PaginationSchema)
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
        dbContext.post.count({
          where: {
            UserId: (await ctx).userId,
          },
        }),
      ]);

      return {
        data,
        paging: {
          page_index,
          page_size,
          row_count,
        },
      } as TypeAPIResponse<TypePendingPost[]>;
    }),
  byId: protectedProcedure
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    //.output(APIResponseSchema(PendingPostSchema.nullable()))
    .query(async ({ input }) => {
      const data = await dbContext.pendingPost.findFirst({
        where: {
          Id: input.Id,
        },
        include: {
          PendingPostCurrentDetail: true,
          PendingPostImage: true,
          GlobalPostType: true,
          PendingPostFeature: true,
        },
      });

      return {
        data,
      } as TypeAPIResponse<TypePendingPost>;
      // return await APIResponseSchema(PendingPostSchema.nullable()).parseAsync({
      //   data,
      // });
    }),
  createFromDraft: protectedProcedure
    .input(AddDraftPostSchema)
    .mutation(
      async ({
        ctx,
        input: {
          Id,
          DraftPostCurrentDetail,
          DraftPostFeature,
          DraftPostImage,
          ...rest
        },
      }) => {
        if ((await ctx).userId == null)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: ``,
          });

        const [createdPendingPost] = await dbContext.$transaction([
          dbContext.pendingPost.create({
            data: {
              ...rest,
              Title: rest?.Title ?? "",
              Description: rest?.Description ?? "",
              Address: rest?.Address ?? "",
              MapUrl: rest?.MapUrl ?? "",
              UserId: (await ctx).userId ?? "",
              PendingPostCurrentDetail: {
                createMany: {
                  data: DraftPostCurrentDetail?.map((item) => ({
                    ...item,
                    Id: undefined,
                  })),
                },
              },
              PendingPostFeature: {
                createMany: {
                  data: DraftPostFeature?.map((item) => ({
                    ...item,
                    Id: undefined,
                  })),
                },
              },
              PendingPostImage: {
                createMany: {
                  data: DraftPostImage?.map(({ Id, Base64Data, ...item }) => ({
                    ...item,
                    Id: undefined,
                  })),
                },
              },
            },
          }),
          dbContext.draftPost.deleteMany({
            where: {
              Id: Id ?? "00000000-0000-0000-0000-000000000000",
              UserId: (await ctx).userId ?? "",
            },
          }),
        ]);

        return { data: createdPendingPost };
      }
    ),
  approve: protectedProcedure
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    // .output(
    //   APIResponseSchema(
    //     PendingPostSchema.omit({
    //       PendingCurrentDetail: true,
    //       PendingFeature: true,
    //       PendingPostImage: true,
    //     }).nullable()
    //   )
    // )
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

      const [updatedPendingPost] = await dbContext.$transaction([
        dbContext.pendingPost.update({
          data: {
            ApprovedByUserId: (await ctx).userId,
            ApprovedDate: new Date(),
          },
          where: {
            Id,
          },
        }),
        dbContext.post.create({
          data: {
            Title: data?.Title ?? "",
            Description: data?.Description ?? "",
            Address: data?.Address ?? "",
            MapUrl: data?.MapUrl ?? "",
            Price: data?.Price,
            TypeId: data?.TypeId ?? "",
            UserId: data?.UserId ?? (await ctx).userId ?? "",
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

      return {
        data: updatedPendingPost,
      };
      // return await APIResponseSchema(
      //   PendingPostSchema.omit({
      //     PendingCurrentDetail: true,
      //     PendingFeature: true,
      //     PendingPostImage: true,
      //   }).nullable()
      // ).parseAsync({ data });
    }),
  reject: protectedProcedure
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    // .output(
    //   APIResponseSchema(
    //     PendingPostSchema.omit({
    //       PendingCurrentDetail: true,
    //       PendingFeature: true,
    //       PendingPostImage: true,
    //     }).nullable()
    //   )
    // )
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

      return { data: pendingPost };
      // return await APIResponseSchema(
      //   PendingPostSchema.omit({
      //     PendingCurrentDetail: true,
      //     PendingFeature: true,
      //     PendingPostImage: true,
      //   }).nullable()
      // ).parseAsync({ data: pendingPost });
    }),
});
