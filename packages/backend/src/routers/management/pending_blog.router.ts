import z from "zod";
import { TypePendingBlog } from "../../schemas/PendingBlog.schema";
import { dbContext } from "../../utils/prisma";
import { RequiredString } from "../../utils/ZodUtils";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema";
import { protectedProcedure, trpcRouter } from "../router";
import { AddDraftBlogSchema } from "../../schemas/AddDraftBlog.schema";
import { v2 as cloudinary } from "cloudinary";

export const PendingBlogRouter = trpcRouter.router({
  byPage: protectedProcedure
    .input(PaginationSchema)
    //.output(APIResponseSchema(z.array(PendingBlogSchema)))
    .query(async ({ ctx, input }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const page_index = input.paging.page_index ?? 1;
      const page_size = input.paging.page_size ?? 10;

      const [data, row_count] = await dbContext.$transaction([
        dbContext.pendingBlog.findMany({
          where: {
            UserId: (await ctx).userId,
          },
          skip: page_index,
          take: page_size,
          include: {
            PendingBlogImage: true,
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
      } as TypeAPIResponse<TypePendingBlog[]>;
      // return await APIResponseSchema(z.array(PendingBlogSchema)).parseAsync({
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
    //.output(APIResponseSchema(PendingBlogSchema.nullable()))
    .query(async ({ input }) => {
      const data = await dbContext.pendingBlog.findFirst({
        where: {
          Id: input.Id,
        },
        include: {
          PendingBlogImage: true,
          GlobalBlogType: true,
        },
      });

      return {
        data,
      } as TypeAPIResponse<TypePendingBlog>;
      // return await APIResponseSchema(PendingBlogSchema.nullable()).parseAsync({
      //   data,
      // });
    }),
  createFromDraft: protectedProcedure
    .input(AddDraftBlogSchema.omit({ GlobalBlogType: true }))
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

      const [createdPendingBlog] = await dbContext.$transaction([
        dbContext.pendingBlog.create({
          data: {
            ...rest,
            UserId: (await ctx).userId ?? "",
            TypeId: rest.TypeId ?? "",
            Description: rest.Description ?? "",
            PendingBlogImage: {
              // createMany: {
              //   data: DraftBlogImage?.map((item) => ({
              //     ...item,
              //     Id: undefined,
              //   })),
              // },
              connectOrCreate: AddImages?.map((item) => ({
                create: item,
                where: {
                  Id: item?.Id ?? "00000000-0000-0000-0000-000000000000",
                },
              })),
            },
          },
        }),
        dbContext.draftBlog.delete({
          where: {
            Id: Id ?? "00000000-0000-0000-0000-000000000000",
            UserId: (await ctx).userId ?? "",
          },
          // include: {
          //   DraftBlogImage: true,
          //   GlobalBlogType: true,
          // },
        }),
      ]);

      return { data: createdPendingBlog };
    }),
  approve: protectedProcedure
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    // .output(
    //   APIResponseSchema(
    //     PendingBlogSchema.omit({
    //       PendingCurrentDetail: true,
    //       PendingFeature: true,
    //       PendingBlogImage: true,
    //     }).nullable()
    //   )
    // )
    .mutation(async ({ ctx, input: { Id } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const data = await dbContext.pendingBlog.findFirst({
        where: {
          Id,
        },
        include: {
          PendingBlogImage: true,
        },
      });

      // const response = await axios<TypeAuth0User>({
      //   url: `${(await ctx).domain}api/v2/users/${(await ctx).userId}`,
      //   method: "GET",
      //   params: {
      //     search_engine: "v3",
      //   },
      //   headers: {
      //     Authorization: `Bearer ${(await ctx).management_token}`,
      //   },
      // });

      // const user = response?.data;

      const [updatedPendingBlog] = await dbContext.$transaction([
        dbContext.pendingBlog.update({
          data: {
            ApprovedBy: (await ctx).userId,
            ApprovedDate: new Date(),
          },
          where: {
            Id,
          },
        }),
        dbContext.blog.create({
          data: {
            Idx: data?.Idx,
            Code: data?.Code,
            Title: data?.Title ?? "",
            Description: data?.Description ?? "",
            Address: data?.Address ?? "",
            TypeId: data?.TypeId ?? "",
            UserId: data?.UserId ?? (await ctx).userId ?? "",
            BlogImage: {
              createMany: {
                data:
                  data?.PendingBlogImage?.map((item) => ({
                    ...item,
                    PendingBlogId: undefined,
                  })) ?? [],
              },
            },
          },
        }),
      ]);

      return {
        data: updatedPendingBlog,
      };
      // return await APIResponseSchema(
      //   PendingBlogSchema.omit({
      //     PendingCurrentDetail: true,
      //     PendingFeature: true,
      //     PendingBlogImage: true,
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
    //     PendingBlogSchema.omit({
    //       PendingCurrentDetail: true,
    //       PendingFeature: true,
    //       PendingBlogImage: true,
    //     }).nullable()
    //   )
    // )
    .mutation(async ({ ctx, input: { Id } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const data = await dbContext.pendingBlog.findFirst({
        where: {
          Id,
        },
        include: {
          PendingBlogImage: true,
        },
      });

      const [, pendingBlog] = await dbContext.$transaction([
        dbContext.draftBlog.create({
          data: {
            Idx: data?.Idx,
            Code: data?.Code ?? "",
            Title: data?.Title ?? "",
            Description: data?.Description ?? "",
            TypeId: data?.TypeId ?? "",
            UserId: data?.UserId ?? "",
            DraftBlogImage: {
              createMany: {
                data:
                  data?.PendingBlogImage?.map((item) => ({
                    ...item,
                    PendingBlogId: undefined,
                  })) ?? [],
              },
            },
          },
        }),
        dbContext.pendingBlog.delete({
          where: {
            Id,
          },
        }),
      ]);

      return { data: pendingBlog };
      // return await APIResponseSchema(
      //   PendingBlogSchema.omit({
      //     PendingCurrentDetail: true,
      //     PendingFeature: true,
      //     PendingBlogImage: true,
      //   }).nullable()
      // ).parseAsync({ data: pendingBlog });
    }),
});
