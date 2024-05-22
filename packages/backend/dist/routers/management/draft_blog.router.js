import z from "zod";
import { DraftBlogSchema } from "../../schemas/DraftBlog.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { AddDraftBlogSchema } from "../../schemas/AddDraftBlog.schema.js";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { v2 as cloudinary } from "cloudinary";
export const DraftBlogRouter = trpcRouter.router({
    all: protectedProcedure
        .input(z.void())
        //.output(APIResponseSchema(z.array(DraftBlogSchema)))
        .query(async () => {
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
        .input(z.object({
        Id: RequiredString,
    }))
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
        const data = await dbContext.draftBlog.create({
            data: {
                ...rest,
                Title: rest?.Title ?? "",
                Description: rest?.Description ?? "",
                TypeId: rest?.TypeId ?? "",
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
        .mutation(async ({ input: { Id, DraftBlogImage, ...rest } }) => {
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
                    //UserId: (await ctx).userId,
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
    }),
    delete: protectedProcedure
        .input(z.object({ Id: RequiredString }))
        //.output(APIResponseSchema(OptionalBoolean.nullable()))
        .mutation(async ({ input: { Id } }) => {
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
