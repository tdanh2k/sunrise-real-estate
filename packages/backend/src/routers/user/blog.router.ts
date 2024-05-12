import z from "zod";
import { BlogSchema, TypeBlog } from "../../schemas/Blog.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema.js";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, trpcRouter } from "../router.js";
import { v2 as cloudinary } from "cloudinary";


export const BlogRouter = trpcRouter.router({
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
        dbContext.blog.findMany({
          skip: page_index,
          take: page_size,
          include: {
            BlogImage: true,
            GlobalBlogType: true,
          },
          where: {
            UserId: (await ctx).userId,
          },
        }),
        dbContext.blog.count({
          where: {
            UserId:
              (await ctx)?.userId ?? "00000000-0000-0000-0000-000000000000",
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
      } as TypeAPIResponse<TypeBlog[]>;
    }),
  byId: protectedProcedure
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    //.output(APIResponseSchema(BlogSchema.nullable()))
    .query(async ({ ctx, input }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const data = await dbContext.blog.findFirst({
        where: {
          Id: input.Id,
          UserId: (await ctx).userId,
        },
        include: {
          BlogImage: true,
          GlobalBlogType: true,
        },
      });

      return {
        data,
      } as TypeAPIResponse<TypeBlog>;
      // return await APIResponseSchema(BlogSchema.nullable()).parseAsync({
      //   data,
      // });
    }),
  update: protectedProcedure
    .input(BlogSchema.omit({ GlobalBlogType: true }))
    // .output(
    //   APIResponseSchema(
    //     BlogSchema.omit({
    //       BlogCurrentDetail: true,
    //       BlogFeature: true,
    //       BlogImage: true,
    //     }).nullable()
    //   )
    // )
    .mutation(async ({ input: { Id, BlogImage, ...rest } }) => {
      //if (ctx.userId == null) return null;

      const result = await dbContext.blog.update({
        where: {
          Id,
        },
        data: {
          ...rest,
          BlogImage: {
            connectOrCreate: BlogImage?.map((item) => ({
              where: {
                Id: item.Id,
              },
              create: item,
            })),
          },
        },
        include: {
          BlogImage: true,
          GlobalBlogType: true,
        },
      });

      return { data: result } as TypeAPIResponse<TypeBlog>;
    }),
  delete: protectedProcedure
    .input(z.object({ Id: RequiredString }))
    .mutation(async ({ ctx, input: { Id } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const [images, deletedData] = await dbContext.$transaction([
        dbContext.blogImage.findMany({
          where: {
            Blog: {
              Id: Id ?? "00000000-0000-0000-0000-000000000000",
              UserId:
                (await ctx).userId ?? "00000000-0000-0000-0000-000000000000",
            },
          },
        }),
        dbContext.blog.delete({
          where: {
            Id: Id ?? "00000000-0000-0000-0000-000000000000",
            UserId: (await ctx).userId,
          },
        }),
      ]);

      if (images?.some((r) => r.Code)) {
        await cloudinary.api.delete_resources(
          images?.filter((r) => r.Code)?.map((r) => r.Code) as string[],
          { type: "upload", resource_type: "image" }
        );
      }

      return {
        data: deletedData,
      };
    }),
});
