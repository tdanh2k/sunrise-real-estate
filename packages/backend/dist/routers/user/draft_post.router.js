import z from "zod";
import { DraftPostSchema, } from "../../schemas/DraftPost.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { AddDraftPostSchema } from "../../schemas/AddDraftPost.schema.js";
import { TRPCError } from "@trpc/server";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { v2 as cloudinary } from "cloudinary";
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
        .input(z.object({
        Id: RequiredString,
    }))
        //.output(APIResponseSchema(DraftPostSchema.nullable()))
        .query(async ({ input }) => {
        const data = await dbContext.draftPost.findFirst({
            where: {
                Id: input.Id ?? "00000000-0000-0000-0000-000000000000",
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
        };
    }),
    create: protectedProcedure
        .input(AddDraftPostSchema)
        .mutation(async ({ ctx, input: { Id, DraftPostCurrentDetail, DraftPostFeature, DraftPostImage, ...rest }, }) => {
        if ((await ctx).userId == null)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const AddImages = [];
        for (const { Base64Data, ...metadata } of DraftPostImage) {
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
        const data = await dbContext.draftPost.create({
            data: {
                ...rest,
                UserId: (await ctx).userId ?? "",
                Title: rest.Title ?? "",
                Description: rest.Description ?? "",
                TypeId: rest?.TypeId ?? "",
                Address: rest?.Address ?? "",
                MapUrl: rest?.MapUrl ?? "",
                DraftPostCurrentDetail: {
                    createMany: {
                        data: DraftPostCurrentDetail?.map((item) => ({
                            ...item,
                            Value: item?.Value ?? "",
                        })) ?? [],
                    },
                },
                DraftPostFeature: {
                    createMany: {
                        data: DraftPostFeature ?? [],
                    },
                },
                DraftPostImage: {
                    createMany: {
                        data: AddImages,
                    },
                },
            },
        });
        return { data };
    }),
    update: protectedProcedure
        .input(DraftPostSchema.omit({ GlobalPostType: true }))
        .mutation(async ({ ctx, input: { Id, DraftPostCurrentDetail, DraftPostFeature, DraftPostImage, ...rest }, }) => {
        if ((await ctx).userId == null)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const AddImages = [];
        for (const { Base64Data, ...metadata } of DraftPostImage) {
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
        const [updatedDraftPost, deletedImages, { count }] = await dbContext.$transaction([
            dbContext.draftPost.update({
                where: {
                    Id: Id ?? "00000000-0000-0000-0000-000000000000",
                    UserId: (await ctx).userId,
                },
                data: {
                    ...rest,
                    DraftPostCurrentDetail: {
                        connectOrCreate: DraftPostCurrentDetail?.map((item) => ({
                            where: {
                                Id: item.Id ?? "00000000-0000-0000-0000-000000000000",
                            },
                            create: item,
                        })),
                    },
                    DraftPostFeature: {
                        connectOrCreate: DraftPostFeature?.map((item) => ({
                            where: {
                                Id: item.Id ?? "00000000-0000-0000-0000-000000000000",
                            },
                            create: item,
                        })),
                    },
                    DraftPostImage: {
                        connectOrCreate: AddImages?.map((item) => ({
                            where: {
                                Id: item.Id,
                            },
                            create: item,
                        })),
                    },
                },
            }),
            dbContext.draftPostImage.findMany({
                where: {
                    Id: {
                        notIn: AddImages?.filter((r) => r.Id)?.map((r) => r.Id) ?? [],
                    },
                    DraftId: Id ?? "00000000-0000-0000-0000-000000000000",
                },
            }),
            dbContext.draftPostImage.deleteMany({
                where: {
                    Id: {
                        notIn: AddImages?.filter((r) => r.Id)?.map((r) => r.Id) ?? [],
                    },
                    DraftId: Id ?? "00000000-0000-0000-0000-000000000000",
                },
            }),
        ]);
        if (deletedImages?.some((r) => r.Code) && count > 0) {
            await cloudinary.api.delete_resources(deletedImages
                ?.filter((r) => r.Code)
                ?.map((r) => r.Code), { type: "upload", resource_type: "image" });
        }
        return { data: updatedDraftPost };
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
