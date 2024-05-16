import z from "zod";
import { BlogSchema } from "../../schemas/Blog.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { AddBlogSchema } from "../../schemas/AddBlog.schema.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
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
        };
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
        };
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
        .input(z.object({
        Id: RequiredString,
    }))
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
        };
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
        const AddImages = [];
        for (const { Base64Data, ...metadata } of BlogImage) {
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
        return { data: result };
    }),
    update: protectedProcedure
        .input(BlogSchema.omit({ GlobalBlogType: true }))
        .mutation(async ({ input: { Id, BlogImage, ...rest } }) => {
        const AddImages = [];
        for (const { Base64Data, ...metadata } of BlogImage) {
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
        const result = await dbContext.blog.update({
            where: {
                Id: Id ?? "00000000-0000-0000-0000-000000000000",
            },
            data: {
                ...rest,
                BlogImage: {
                    connectOrCreate: AddImages?.map(({ BlogId, ...item }) => ({
                        create: item,
                        where: {
                            Id: item.Id ?? "00000000-0000-0000-0000-000000000000",
                            BlogId: BlogId ?? "00000000-0000-0000-0000-000000000000",
                        },
                    })),
                    deleteMany: AddImages?.some((r) => r.Id)
                        ? {
                            BlogId: Id ?? "00000000-0000-0000-0000-000000000000",
                            Id: {
                                notIn: AddImages?.map((r) => r.Id),
                            },
                        }
                        : undefined,
                },
            },
            include: {
                BlogImage: true,
                BlogStats: true,
                GlobalBlogType: true,
            },
        });
        return { data: result };
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
                        UserId: (await ctx).userId ?? "00000000-0000-0000-0000-000000000000",
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
            await cloudinary.api.delete_resources(images?.filter((r) => r.Code)?.map((r) => r.Code), { type: "upload", resource_type: "image" });
        }
        return {
            data: deletedData,
        };
    }),
});
