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
        //.output(APIResponseSchema(z.array(PostSchema)))
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
        // return await APIResponseSchema(z.array(PostSchema)).parseAsync({
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
        //.output(APIResponseSchema(PostSchema.nullable()))
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
        // .output(
        //   APIResponseSchema(
        //     PostSchema.omit({
        //       PostCurrentDetail: true,
        //       PostFeature: true,
        //       PostImage: true,
        //     }).nullable()
        //   )
        // )
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
                    // connectOrCreate: PostCurrentDetail?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                    createMany: {
                        data: PostCurrentDetail ?? [],
                    },
                },
                PostFeature: {
                    // connectOrCreate: PostFeature?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                    createMany: {
                        data: PostFeature ?? [],
                    },
                },
                PostImage: {
                    // connectOrCreate: PostImage?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
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
        // return await APIResponseSchema(
        //   PostSchema.omit({
        //     PostCurrentDetail: true,
        //     PostFeature: true,
        //     PostImage: true,
        //   }).nullable()
        // ).parseAsync({ data: result });
    }),
    update: protectedProcedure
        .input(PostSchema)
        // .output(
        //   APIResponseSchema(
        //     PostSchema.omit({
        //       PostCurrentDetail: true,
        //       PostFeature: true,
        //       PostImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ input: { Id, PostCurrentDetail, PostFeature, PostImage, ...rest }, }) => {
        //if (ctx.userId == null) return null;
        const result = await dbContext.post.update({
            where: {
                Id,
            },
            data: {
                ...rest,
                PostCurrentDetail: {
                    connectOrCreate: PostCurrentDetail?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
                PostFeature: {
                    connectOrCreate: PostFeature?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
                PostImage: {
                    connectOrCreate: PostImage?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
            },
            include: {
                PostCurrentDetail: true,
                PostFeature: true,
                PostImage: true,
            },
        });
        return { data: result };
        // return await APIResponseSchema(
        //   PostSchema.omit({
        //     PostCurrentDetail: true,
        //     PostFeature: true,
        //     PostImage: true,
        //   }).nullable()
        // ).parseAsync({ data: result });
    }),
});
