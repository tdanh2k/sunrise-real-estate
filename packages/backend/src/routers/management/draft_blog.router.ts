import z from "zod";
import { DraftBlogSchema } from "../../schemas/DraftBlog.schema";
import { dbContext } from "../../utils/prisma";
import { RequiredString } from "../../utils/ZodUtils";
import { AddDraftBlogSchema } from "../../schemas/AddDraftBlog.schema";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema";
import { protectedProcedure, trpcRouter } from "../router";

export const DraftBlogRouter = trpcRouter.router({
  all: protectedProcedure
    .input(z.void())
    //.output(APIResponseSchema(z.array(DraftBlogSchema)))
    .query(async (opt) => {
      const data = await dbContext.draftBlog.findMany({
        include: {
          DraftBlogImage: true,
          GlobalBlogType: true,
        },
      });

      return {
        data,
      };
      // return await APIResponseSchema(z.array(DraftBlogSchema)).parseAsync({
      //   data,
      // });
    }),
  byPage: protectedProcedure
    .input(PaginationSchema)
    //.output(APIResponseSchema(z.array(DraftBlogSchema)))
    .query(async ({ input }) => {
      const page_index = input.paging.page_index ?? 1;
      const page_size = input.paging.page_size ?? 10;

      const [data, row_count] = await dbContext.$transaction([
        dbContext.draftBlog.findMany({
          skip: page_index,
          take: page_size,
          include: {
            DraftBlogImage: true,
            GlobalBlogType: true,
          },
        }),
        dbContext.draftBlog.count(),
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
      };
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
    //     }).nullable()
    //   )
    // )
    .mutation(async ({ ctx, input: { DraftBlogImage, ...rest } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const data = await dbContext.draftBlog.create({
        data: {
          ...rest,
          UserId: (await ctx).userId ?? "",
          DraftBlogImage: {
            createMany: {
              data: DraftBlogImage,
            },
            // connectOrCreate: DraftBlogImage?.map((item) => ({
            //   where: {
            //     Id: item.Id,
            //   },
            //   create: item,
            // })),
          },
        },
        include: {
          DraftBlogImage: true,
          GlobalBlogType: true,
        },
      });

      return { data };
      // return await APIResponseSchema(
      //   DraftBlogSchema.omit({
      //     DraftBlogCurrentDetail: true,
      //     DraftBlogFeature: true,
      //     DraftBlogImage: true,
      //   }).nullable()
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
    .mutation(
      async ({
        ctx,
        input: {
          Id,
          DraftBlogImage,
          ...rest
        },
      }) => {
        //if (ctx.userId == null) return null;

        const result = await dbContext.draftBlog.update({
          where: {
            Id,
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
      }
    ),

  delete: protectedProcedure
    .input(z.object({ Id: RequiredString }))
    //.output(APIResponseSchema(OptionalBoolean.nullable()))
    .mutation(async ({ ctx, input: { Id } }) => {
      //if (ctx.userId == null) return null;

      const result = await dbContext.draftBlog.delete({
        where: {
          Id,
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
