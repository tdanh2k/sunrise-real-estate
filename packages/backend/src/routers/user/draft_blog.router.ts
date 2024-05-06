import z from "zod";
import {
  DraftBlogSchema,
  TypeDraftBlog,
} from "../../schemas/DraftBlog.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { AddDraftBlogSchema } from "../../schemas/AddDraftBlog.schema.js";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema.js";
import { v2 as cloudinary } from "cloudinary";

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

      const AddImages: Omit<(typeof DraftBlogImage)[number], "Base64Data">[] =
        [];

      for (const { Base64Data, ...metadata } of DraftBlogImage) {
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
                  Path: result?.secure_url,
                  Size: result?.bytes ?? metadata?.Size,
                });
            }
          );
        }
      }

      const data = await dbContext.draftBlog.upsert({
        create: {
          ...rest,
          TypeId: rest.TypeId ?? "",
          Code: rest.Code ?? "",
          Title: rest.Title ?? "",
          Description: rest.Description ?? "",
          UserId: (await ctx).userId ?? "",
          DraftBlogImage: {
            createMany: {
              data: AddImages,
            },
          },
        },
        update: {
          ...rest,
          DraftBlogImage: {
            connectOrCreate: AddImages?.map((item) => ({
              create: item,
              where: {
                Id: item.Id ?? "00000000-0000-0000-0000-000000000000",
              },
            })),
            deleteMany: AddImages?.some((r) => r.Id)
              ? {
                  Id: {
                    notIn: AddImages?.map((r) => r.Id) as string[],
                  },
                }
              : undefined,
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

      const AddImages: Omit<(typeof DraftBlogImage)[number], "Base64Data">[] =
        [];

      for (const { Base64Data, ...metadata } of DraftBlogImage) {
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

      // const result = await dbContext.draftBlog.update({
      //   where: {
      //     Id: Id ?? "00000000-0000-0000-0000-000000000000",
      //     UserId: (await ctx).userId,
      //   },
      //   include: {
      //     DraftBlogImage: true,
      //     GlobalBlogType: true,
      //   },
      //   data: {
      //     ...rest,
      //     DraftBlogImage: {
      //       connectOrCreate: AddImages?.map((item) => ({
      //         where: {
      //           Id: item.Id,
      //         },
      //         create: item,
      //       })),
      //       deleteMany: AddImages?.some((r) => r.Id)
      //         ? {
      //             Id: {
      //               notIn: AddImages?.map((r) => r.Id) as string[],
      //             },
      //           }
      //         : undefined,
      //     },
      //   },
      // });

      const [updatedDraftBlog, deletedImages, { count }] =
        await dbContext.$transaction([
          dbContext.draftBlog.update({
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
                connectOrCreate: AddImages?.map((item) => ({
                  where: {
                    Id: item.Id,
                  },
                  create: item,
                })),
                // deleteMany: AddImages?.some((r) => r.Id)
                //   ? {
                //       Id: {
                //         notIn: AddImages?.map((r) => r.Id) as string[],
                //       },
                //     }
                //   : undefined,
              },
            },
          }),
          dbContext.draftBlogImage.findMany({
            where: {
              Id: {
                notIn: AddImages?.map((r) => r.Id) as string[],
              },
              DraftBlogId: Id,
            },
          }),
          dbContext.draftBlogImage.deleteMany({
            where: {
              Id: {
                notIn: AddImages?.map((r) => r.Id) as string[],
              },
              DraftBlogId: Id,
            },
          }),
        ]);

      if (deletedImages?.some((r) => r.Code) && count > 0) {
        await cloudinary.api.delete_resources(
          deletedImages?.filter((r) => r.Code)?.map((r) => r.Code) as string[],
          { type: "upload", resource_type: "image" }
        );
      }

      return { data: updatedDraftBlog };

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

      const [images, deletedDraftBlog] = await dbContext.$transaction([
        dbContext.draftBlogImage.findMany({
          where: {
            DraftBlogId: Id,
            DraftBlog: {
              UserId: (await ctx).userId,
            },
          },
        }),
        dbContext.draftBlog.delete({
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
        data: deletedDraftBlog,
      };

      // return await APIResponseSchema(OptionalBoolean.nullable()).parseAsync({
      //   data: Boolean(result),
      // });
    }),
});
