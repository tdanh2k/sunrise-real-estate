import z from "zod";
import { DraftPostSchema, TypeDraftPost } from "../../schemas/DraftPost.schema";
import { dbContext } from "../../utils/prisma";
import { RequiredString } from "../../utils/ZodUtils";
import { AddDraftPostSchema } from "../../schemas/AddDraftPost.schema";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema";
import { protectedProcedure, trpcRouter } from "../router";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema";

export const DraftPostRouter = trpcRouter.router({
  byPage: protectedProcedure
    .input(PaginationSchema)
    //.output(APIResponseSchema(z.array(DraftPostSchema)))
    .query(async ({ ctx, input }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const page_index = input.paging.page_index ?? 1;
      const page_size = input.paging.page_size ?? 10;

      const [data, row_count] = await dbContext.$transaction([
        dbContext.draftPost.findMany({
          where: {
            UserId: (await ctx).userId,
          },
          skip: page_index,
          take: page_size,
          include: {
            DraftPostCurrentDetail: true,
            DraftPostImage: true,
            DraftPostFeature: true,
          },
        }),
        dbContext.post.count(),
      ]);

      return {
        data,
        paging: {
          page_index,
          page_size,
          row_count,
        },
      };
      // return await APIResponseSchema(z.array(DraftPostSchema)).parseAsync({
      //   data,
      //   paging: {
      //     page_index,
      //     page_size,
      //     row_count,
      //   },
      // });
    }),
  byId: protectedProcedure
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    //.output(APIResponseSchema(DraftPostSchema.nullable()))
    .query(async ({ input }) => {
      const data = await dbContext.draftPost.findFirst({
        where: {
          Id: input.Id,
        },
        include: {
          DraftPostCurrentDetail: true,
          DraftPostImage: true,
          GlobalPostType: true,
          DraftPostFeature: true,
        },
      });

      return {
        data,
      } as TypeAPIResponse<TypeDraftPost>;
      // return await APIResponseSchema(DraftPostSchema.nullable()).parseAsync({
      //   data,
      // });
    }),
  create: protectedProcedure
    .input(AddDraftPostSchema)
    // .output(
    //   APIResponseSchema(
    //     DraftPostSchema.omit({
    //       DraftPostCurrentDetail: true,
    //       DraftPostFeature: true,
    //       DraftPostImage: true,
    //     })
    //       .extend({
    //         Price: NonNegativeNumber.optional(),
    //       })
    //       .nullable()
    //   )
    // )
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

        const data = await dbContext.draftPost.upsert({
          create: {
            ...rest,
            UserId: (await ctx).userId ?? "",
            DraftPostCurrentDetail: {
              createMany: {
                data: DraftPostCurrentDetail,
              },
            },
            DraftPostFeature: {
              createMany: {
                data: DraftPostFeature,
              },
            },
            DraftPostImage: {
              createMany: {
                data: DraftPostImage,
              },
            },
          },
          update: {
            ...rest,
            DraftPostCurrentDetail: {
              connectOrCreate: DraftPostCurrentDetail?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
            DraftPostFeature: {
              connectOrCreate: DraftPostFeature?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
            DraftPostImage: {
              connectOrCreate: DraftPostImage?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
          },
          where: {
            Id: Id ?? "00000000-0000-0000-0000-000000000000",
            UserId: (await ctx).userId,
          },
        });

        // const data = await dbContext.draftPost.create({
        //   data: {
        //     ...rest,
        //     UserId: (await ctx).userId ?? "",
        //     DraftPostCurrentDetail: {
        //       createMany: {
        //         data: DraftPostCurrentDetail,
        //       },
        //       // connectOrCreate: DraftPostCurrentDetail?.map((item) => ({
        //       //   where: {
        //       //     Id: item.Id,
        //       //   },
        //       //   create: item,
        //       // })),
        //     },
        //     DraftPostFeature: {
        //       createMany: {
        //         data: DraftPostFeature,
        //       },
        //       // connectOrCreate: DraftPostFeature?.map((item) => ({
        //       //   where: {
        //       //     Id: item.Id,
        //       //   },
        //       //   create: item,
        //       // })),
        //     },
        //     DraftPostImage: {
        //       createMany: {
        //         data: DraftPostImage,
        //       },
        //       // connectOrCreate: DraftPostImage?.map((item) => ({
        //       //   where: {
        //       //     Id: item.Id,
        //       //   },
        //       //   create: item,
        //       // })),
        //     },
        //   },
        // });

        return { data };

        // return await APIResponseSchema(
        //   DraftPostSchema.omit({
        //     DraftPostCurrentDetail: true,
        //     DraftPostFeature: true,
        //     DraftPostImage: true,
        //   })
        //     .extend({
        //       Price: NonNegativeNumber.optional(),
        //     })
        //     .nullable()
        // ).parseAsync({ data });
      }
    ),
  update: protectedProcedure
    .input(DraftPostSchema.omit({ GlobalPostType: true }))
    // .output(
    //   APIResponseSchema(
    //     DraftPostSchema.omit({
    //       DraftPostCurrentDetail: true,
    //       DraftPostFeature: true,
    //       DraftPostImage: true,
    //     }).nullable()
    //   )
    // )
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

        const result = await dbContext.draftPost.update({
          where: {
            Id: Id ?? "00000000-0000-0000-0000-000000000000",
            UserId: (await ctx).userId,
          },
          data: {
            ...rest,
            DraftPostCurrentDetail: {
              connectOrCreate: DraftPostCurrentDetail?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
            DraftPostFeature: {
              connectOrCreate: DraftPostFeature?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
            DraftPostImage: {
              connectOrCreate: DraftPostImage?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
          },
        });

        return { data: result };

        // return await APIResponseSchema(
        //   DraftPostSchema.omit({
        //     DraftPostCurrentDetail: true,
        //     DraftPostFeature: true,
        //     DraftPostImage: true,
        //   })
        // ).parseAsync({ data: result });
      }
    ),

  delete: protectedProcedure
    .input(z.object({ Id: RequiredString }))
    //.output(APIResponseSchema(OptionalBoolean.nullable()))
    .mutation(async ({ ctx, input: { Id } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const result = await dbContext.draftPost.delete({
        where: {
          Id: Id ?? "00000000-0000-0000-0000-000000000000",
          UserId: (await ctx).userId,
        },
      });

      return {
        data: result,
      };

      // return await APIResponseSchema(OptionalBoolean.nullable()).parseAsync({
      //   data: Boolean(result),
      // });
    }),
});
