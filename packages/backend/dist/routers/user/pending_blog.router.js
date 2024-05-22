import z from "zod";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { AddDraftBlogSchema } from "../../schemas/AddDraftBlog.schema.js";
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
            dbContext.blog.count({
                where: { UserId: (await ctx).userId },
            }),
        ]);
        return {
            data,
            paging: {
                page_index,
                page_size,
                row_count,
            },
        };
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
        .input(z.object({
        Id: RequiredString,
    }))
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
        };
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
        const AddImages = [];
        for (const { Base64Data, ...metadata } of DraftBlogImage) {
            if (metadata.Id) {
                AddImages.push(metadata);
            }
            else if (Base64Data != null) {
                await cloudinary.uploader.upload(Base64Data, {
                    use_filename: true,
                    access_mode: "public",
                }, (error, result) => {
                    if (!error)
                        AddImages.push({
                            ...metadata,
                            Code: result?.public_id,
                            Path: result?.secure_url,
                            Size: result?.bytes ?? metadata?.Size,
                        });
                });
            }
        }
        const [createdPendingBlog] = await dbContext.$transaction([
            dbContext.pendingBlog.create({
                data: {
                    ...rest,
                    UserId: (await ctx).userId ?? "",
                    TypeId: rest.TypeId ?? "",
                    Title: rest?.Title ?? "",
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
            dbContext.draftBlog.deleteMany({
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
        .input(z.object({
        Id: RequiredString,
    }))
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
        const [updatedPendingBlog] = await dbContext.$transaction([
            dbContext.pendingBlog.update({
                data: {
                    ApprovedByUserId: (await ctx).userId,
                    ApprovedDate: new Date(),
                },
                where: {
                    Id,
                },
            }),
            dbContext.blog.create({
                data: {
                    Title: data?.Title ?? "",
                    Description: data?.Description ?? "",
                    Address: data?.Address ?? "",
                    TypeId: data?.TypeId ?? "",
                    UserId: data?.UserId ?? (await ctx).userId ?? "",
                    BlogImage: {
                        createMany: {
                            data: data?.PendingBlogImage?.map((item) => ({
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
        .input(z.object({
        Id: RequiredString,
    }))
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
                    Title: data?.Title ?? "",
                    Description: data?.Description ?? "",
                    TypeId: data?.TypeId ?? "",
                    UserId: data?.UserId ?? "",
                    DraftBlogImage: {
                        createMany: {
                            data: data?.PendingBlogImage?.map((item) => ({
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
