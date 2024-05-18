import z from "zod";
import { PostSchema } from "../../schemas/Post.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { AddPostSchema } from "../../schemas/AddPost.schema.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, trpcRouter } from "../router.js";
import { v2 as cloudinary } from "cloudinary";
export const PostRouter = trpcRouter.router({
    all: protectedProcedure
        .input(z.void())
        //.output(APIResponseSchema(z.array(PostSchema)))
        .query(async () => {
        const data = await dbContext.post.findMany({
            include: {
                PostCurrentDetail: true,
                PostImage: true,
                PostType: true,
                PostFeature: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(z.array(PostSchema)).parseAsync({
        //   data,
        // });
    }),
    byPage: protectedProcedure
        .input(PaginationSchema)
        .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await dbContext.$transaction([
            dbContext.post.findMany({
                skip: page_index,
                take: page_size,
                include: {
                    PostCurrentDetail: true,
                    PostImage: true,
                    PostType: true,
                    PostFeature: true,
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
    }),
    byId: protectedProcedure
        .input(z.object({
        Id: RequiredString,
    }))
        .query(async ({ input }) => {
        const data = await dbContext.post.findFirst({
            where: {
                Id: input.Id,
            },
            include: {
                PostCurrentDetail: true,
                PostImage: true,
                PostType: true,
                PostFeature: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(PostSchema.nullable()).parseAsync({
        //   data,
        // });
    }),
    publish: protectedProcedure
        .input(AddPostSchema)
        .mutation(async ({ ctx, input: { PostCurrentDetail, PostFeature, PostImage, ...rest }, }) => {
        if ((await ctx).userId == null)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const AddImages = [];
        for (const { Base64Data, ...metadata } of PostImage ?? []) {
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
        const result = await dbContext.post.create({
            data: {
                ...rest,
                UserId: (await ctx).userId ?? "",
                PostCurrentDetail: {
                    createMany: {
                        data: PostCurrentDetail ?? [],
                    },
                },
                PostFeature: {
                    createMany: {
                        data: PostFeature ?? [],
                    },
                },
                PostImage: {
                    createMany: {
                        data: AddImages ?? [],
                    },
                },
            },
            include: {
                PostCurrentDetail: true,
                PostFeature: true,
                PostImage: true,
            },
        });
        return { data: result };
    }),
    update: protectedProcedure
        .input(PostSchema.omit({ PostType: true }))
        .mutation(async ({ input: { Id, PostCurrentDetail, PostFeature, PostImage, ...rest }, }) => {
        const AddImages = [];
        for (const { Base64Data, ...metadata } of PostImage ?? []) {
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
        const [updatedPost, deletedImages, { count }] = await dbContext.$transaction([
            dbContext.post.update({
                where: {
                    Id: Id ?? "00000000-0000-0000-0000-000000000000",
                },
                data: {
                    ...rest,
                    PostCurrentDetail: {
                        connectOrCreate: PostCurrentDetail?.map((item) => ({
                            where: {
                                Id: item.Id ?? "00000000-0000-0000-0000-000000000000",
                            },
                            create: item,
                        })),
                    },
                    PostFeature: {
                        connectOrCreate: PostFeature?.map((item) => ({
                            where: {
                                Id: item.Id ?? "00000000-0000-0000-0000-000000000000",
                            },
                            create: item,
                        })),
                    },
                    PostImage: {
                        connectOrCreate: AddImages?.map((item) => ({
                            where: {
                                Id: item.Id ?? "00000000-0000-0000-0000-000000000000",
                            },
                            create: item,
                        })),
                    },
                },
            }),
            dbContext.postImage.findMany({
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
                    PostId: Id ?? "00000000-0000-0000-0000-000000000000",
                },
            }),
            dbContext.postImage.deleteMany({
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
                    PostId: Id ?? "00000000-0000-0000-0000-000000000000",
                },
            }),
        ]);
        if (deletedImages?.some((r) => r.Code) && count > 0) {
            await cloudinary.api.delete_resources(deletedImages
                ?.filter((r) => r.Code)
                ?.map((r) => r.Code), { type: "upload", resource_type: "image" });
        }
        return { data: updatedPost };
    }),
    delete: protectedProcedure
        .input(z.object({
        Id: RequiredString,
    }))
        .mutation(async ({ input }) => {
        const data = await dbContext.post.delete({
            where: {
                Id: input?.Id ?? "00000000-0000-0000-0000-000000000000",
            },
            include: {
                PostImage: true,
            },
        });
        if (data?.PostImage?.some((r) => r.Code)) {
            await cloudinary.api.delete_resources(data?.PostImage?.filter((r) => r.Code)?.map((r) => r.Code), { type: "upload", resource_type: "image" });
        }
        return { data };
    }),
});
