import z from "zod";
import { DraftBlogSchema, TypeDraftBlog } from "../../schemas/DraftBlog.schema";
import { dbContext } from "../../utils/prisma";
import { RequiredString } from "../../utils/ZodUtils";
import { AddDraftBlogSchema } from "../../schemas/AddDraftBlog.schema";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema";
import { protectedProcedure, trpcRouter } from "../router";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema";

export const DraftBlogRouter = trpcRouter.router({
  byPage: protectedProcedure
    .input(PaginationSchema)
    //.output(APIResponseSchema(z.array(DraftBlogSchema)))
    .query(async ({ ctx, input }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const page_index = input.paging.page_index ?? 1;
      const page_size = input.paging.page_size ?? 10;

      const [data, row_count] = await dbContext.$transaction([
        dbContext.draftBlog.findMany({
          where: {
            UserId: (await ctx).userId,
          },
          skip: page_index,
          take: page_size,
          include: {
            DraftBlogImage: true,
            GlobalBlogType: true,
          },
        }),
        dbContext.blog.count(),
      ]);

      return {
        data,
        paging: {
          page_index,
          page_size,
          row_count,
        },
      };
      // return await APIResponseSchema(z.array(DraftBlogSchema)).parseAsync({
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
    //.output(APIResponseSchema(DraftBlogSchema.nullable()))
    .query(async ({ input }) => {
      const data = await dbContext.draftBlog.findFirst({
        where: {
          Id: input.Id,
        },
        include: {
          DraftBlogImage: true,
          GlobalBlogType: true,
        },
      });

      return {
        data,
      } as TypeAPIResponse<TypeDraftBlog>;
      // return await APIResponseSchema(DraftBlogSchema.nullable()).parseAsync({
      //   data,
      // });
    }),
  create: protectedProcedure
    .input(AddDraftBlogSchema.omit({ GlobalBlogType: true }))
    // .output(
    //   APIResponseSchema(
    //     DraftBlogSchema.omit({
    //       DraftBlogCurrentDetail: true,
    //       DraftBlogFeature: true,
    //       DraftBlogImage: true,
    //     })
    //       .extend({
    //         Price: NonNegativeNumber.optional(),
    //       })
    //       .nullable()
    //   )
    // )
    .mutation(async ({ ctx, input: { Id, DraftBlogImage, ...rest } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const data = await dbContext.draftBlog.upsert({
        create: {
          ...rest,
          UserId: (await ctx).userId ?? "",
          DraftBlogImage: {
            createMany: {
              data: DraftBlogImage,
            },
          },
        },
        update: {
          ...rest,
          DraftBlogImage: {
            connectOrCreate: DraftBlogImage?.map((item) => ({
              where: {
                Id: item.Id,
              },
              create: item,
            })),
          },
        },
        include: {
          DraftBlogImage: true,
          GlobalBlogType: true,
        },
        where: {
          Id: Id ?? "00000000-0000-0000-0000-000000000000",
          UserId: (await ctx).userId,
        },
      });

      // const data = await dbContext.draftBlog.create({
      //   data: {
      //     ...rest,
      //     UserId: (await ctx).userId ?? "",
      //     DraftBlogCurrentDetail: {
      //       createMany: {
      //         data: DraftBlogCurrentDetail,
      //       },
      //       // connectOrCreate: DraftBlogCurrentDetail?.map((item) => ({
      //       //   where: {
      //       //     Id: item.Id,
      //       //   },
      //       //   create: item,
      //       // })),
      //     },
      //     DraftBlogFeature: {
      //       createMany: {
      //         data: DraftBlogFeature,
      //       },
      //       // connectOrCreate: DraftBlogFeature?.map((item) => ({
      //       //   where: {
      //       //     Id: item.Id,
      //       //   },
      //       //   create: item,
      //       // })),
      //     },
      //     DraftBlogImage: {
      //       createMany: {
      //         data: DraftBlogImage,
      //       },
      //       // connectOrCreate: DraftBlogImage?.map((item) => ({
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
      //   DraftBlogSchema.omit({
      //     DraftBlogCurrentDetail: true,
      //     DraftBlogFeature: true,
      //     DraftBlogImage: true,
      //   })
      //     .extend({
      //       Price: NonNegativeNumber.optional(),
      //     })
      //     .nullable()
      // ).parseAsync({ data });
    }),
  update: protectedProcedure
    .input(DraftBlogSchema.omit({ GlobalBlogType: true }))
    // .output(
    //   APIResponseSchema(
    //     DraftBlogSchema.omit({
    //       DraftBlogCurrentDetail: true,
    //       DraftBlogFeature: true,
    //       DraftBlogImage: true,
    //     }).nullable()
    //   )
    // )
    .mutation(async ({ ctx, input: { Id, DraftBlogImage, ...rest } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const result = await dbContext.draftBlog.update({
        where: {
          Id: Id ?? "00000000-0000-0000-0000-000000000000",
          UserId: (await ctx).userId,
        },
        include: {
          DraftBlogImage: true,
          GlobalBlogType: true,
        },
        data: {
          ...rest,
          DraftBlogImage: {
            connectOrCreate: DraftBlogImage?.map((item) => ({
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
      //   DraftBlogSchema.omit({
      //     DraftBlogCurrentDetail: true,
      //     DraftBlogFeature: true,
      //     DraftBlogImage: true,
      //   })
      // ).parseAsync({ data: result });
    }),

  delete: protectedProcedure
    .input(z.object({ Id: RequiredString }))
    //.output(APIResponseSchema(OptionalBoolean.nullable()))
    .mutation(async ({ ctx, input: { Id } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const result = await dbContext.draftBlog.delete({
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
