import z from "zod";
import { BlogSchema, TypeBlog } from "../../schemas/Blog.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { AddBlogSchema } from "../../schemas/AddBlog.schema.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema.js";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, trpcRouter } from "../router.js";
import { v2 as cloudinary } from "cloudinary";

export const BlogRouter = trpcRouter.router({
  all: protectedProcedure.input(z.void()).query(async () => {
    const data = await dbContext.blog.findMany({
      include: {
        BlogImage: true,
        GlobalBlogType: true,
      },
    });

    return {
      data,
    } as TypeAPIResponse<TypeBlog[]>;
    // return await APIResponseSchema(z.array(BlogSchema)).parseAsync({
    //   data,
    // });
  }),
  byPage: protectedProcedure
    .input(PaginationSchema)
    .query(async ({ input }) => {
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
      } as TypeAPIResponse<TypeBlog[]>;
      // return await APIResponseSchema(z.array(BlogSchema)).parseAsync({
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
    .query(async ({ input }) => {
      const data = await dbContext.blog.findFirst({
        where: {
          Id: input.Id,
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
  publish: protectedProcedure
    .input(AddBlogSchema)
    .mutation(async ({ ctx, input: { BlogImage, ...rest } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const AddImages: Omit<(typeof BlogImage)[number], "Base64Data">[] = [];

      for (const { Base64Data, ...metadata } of BlogImage) {
        if (metadata.Id) {
          AddImages.push(metadata);
        } else if (Base64Data != null) {
          await cloudinary.uploader.upload(
            Base64Data,
            {
              use_filename: true,
              access_mode: "public",
            },
            (error, result) => {
              if (!error)
                AddImages.push({
                  ...metadata,
                  Code: result?.public_id,
                  Path: result?.secure_url ?? "",
                  Size: result?.bytes ?? metadata?.Size,
                });
            }
          );
        }
      }

      const result = await dbContext.blog.create({
        data: {
          ...rest,
          UserId: (await ctx).userId ?? "",
          BlogImage: {
            createMany: {
              data: AddImages,
            },
          },
        },
        include: {
          BlogImage: true,
          BlogStats: true,
          GlobalBlogType: true,
        },
      });

      return { data: result } as TypeAPIResponse<TypeBlog>;
    }),
  update: protectedProcedure
    .input(BlogSchema.omit({ GlobalBlogType: true }))
    .mutation(async ({ input: { Id, BlogImage, ...rest } }) => {
      const AddImages: Omit<(typeof BlogImage)[number], "Base64Data">[] = [];

      for (const { Base64Data, ...metadata } of BlogImage) {
        if (metadata.Id) {
          AddImages.push(metadata);
        } else if (Base64Data != null) {
          await cloudinary.uploader.upload(
            Base64Data,
            {
              use_filename: true,
              access_mode: "public",
            },
            (error, result) => {
              if (!error)
                AddImages.push({
                  ...metadata,
                  Code: result?.public_id,
                  Path: result?.secure_url ?? "",
                  Size: result?.bytes ?? metadata?.Size,
                });
            }
          );
        }
      }

      const [updatedBlog, deletedImages, { count }] =
        await dbContext.$transaction([
          dbContext.blog.update({
            where: {
              Id: Id ?? "00000000-0000-0000-0000-000000000000",
            },
            include: {
              BlogImage: true,
              GlobalBlogType: true,
            },
            data: {
              ...rest,
              BlogImage: {
                connectOrCreate: AddImages?.map((item) => ({
                  where: {
                    Id: item.Id,
                  },
                  create: item,
                })),
              },
            },
          }),
          dbContext.blogImage.findMany({
            where: {
              // Id: {
              //   notIn:
              //     (AddImages?.filter((r) => r.Id)?.map(
              //       (r) => r.Id
              //     ) as string[]) ?? [],
              // },
              Code: {
                notIn: (AddImages?.map((r) => r.Code) as string[]) ?? [],
              },
              BlogId: Id,
            },
          }),
          dbContext.blogImage.deleteMany({
            where: {
              // Id: {
              //   notIn:
              //     (AddImages?.filter((r) => r.Id)?.map(
              //       (r) => r.Id
              //     ) as string[]) ?? [],
              // },
              Code: {
                notIn: (AddImages?.map((r) => r.Code) as string[]) ?? [],
              },
              BlogId: Id,
            },
          }),
        ]);
        
      if (deletedImages?.some((r) => r.Code) && count > 0) {
        await cloudinary.api.delete_resources(
          deletedImages?.filter((r) => r.Code)?.map((r) => r.Code) as string[],
          { type: "upload", resource_type: "image" }
        );
      }

      return { data: updatedBlog };
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
