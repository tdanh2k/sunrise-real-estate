import z from "zod";
import { DraftBlogSchema, } from "../../schemas/DraftBlog.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { AddDraftBlogSchema } from "../../schemas/AddDraftBlog.schema.js";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
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
            dbContext.blog.count({
                where: {
                    UserId: (await ctx)?.userId ?? "00000000-0000-0000-0000-000000000000",
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
        .input(z.object({
        Id: RequiredString,
    }))
        //.output(APIResponseSchema(DraftBlogSchema.nullable()))
        .query(async ({ input, ctx }) => {
        const data = await dbContext.draftBlog.findFirst({
            where: {
                Id: input.Id,
                UserId: (await ctx)?.userId ?? "00000000-0000-0000-0000-000000000000",
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
        const data = await dbContext.draftBlog.create({
            data: {
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
            include: {
                DraftBlogImage: true,
                GlobalBlogType: true,
            },
        });
        return { data };
    }),
    update: protectedProcedure
        .input(DraftBlogSchema.omit({ GlobalBlogType: true }))
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
                            Path: result?.secure_url ?? "",
                            Size: result?.bytes ?? metadata?.Size,
                        });
                });
            }
        }
        const [updatedDraftBlog, deletedImages, { count }] = await dbContext.$transaction([
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
                    },
                },
            }),
            dbContext.draftBlogImage.findMany({
                where: {
                    // Id: {
                    //   notIn:
                    //     (AddImages?.filter((r) => r.Id)?.map(
                    //       (r) => r.Id
                    //     ) as string[]) ?? [],
                    // },
                    Code: {
                        notIn: AddImages?.map((r) => r.Code) ?? [],
                    },
                    DraftBlogId: Id,
                },
            }),
            dbContext.draftBlogImage.deleteMany({
                where: {
                    // Id: {
                    //   notIn:
                    //     (AddImages?.filter((r) => r.Id)?.map(
                    //       (r) => r.Id
                    //     ) as string[]) ?? [],
                    // },
                    Code: {
                        notIn: AddImages?.map((r) => r.Code) ?? [],
                    },
                    DraftBlogId: Id,
                },
            }),
        ]);
        if (deletedImages?.some((r) => r.Code) && count > 0) {
            await cloudinary.api.delete_resources(deletedImages?.filter((r) => r.Code)?.map((r) => r.Code), { type: "upload", resource_type: "image" });
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
        const [images, deletedData] = await dbContext.$transaction([
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
            await cloudinary.api.delete_resources(images?.filter((r) => r.Code)?.map((r) => r.Code), { type: "upload", resource_type: "image" });
        }
        return {
            data: deletedData,
        };
        // return await APIResponseSchema(OptionalBoolean.nullable()).parseAsync({
        //   data: Boolean(result),
        // });
    }),
});
