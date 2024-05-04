"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const Post_schema_1 = require("../../schemas/Post.schema");
const prisma_1 = require("../../utils/prisma");
const ZodUtils_1 = require("../../utils/ZodUtils");
const AddPost_schema_1 = require("../../schemas/AddPost.schema");
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const server_1 = require("@trpc/server");
const router_1 = require("../router");
const cloudinary_1 = require("cloudinary");
exports.PostRouter = router_1.trpcRouter.router({
    all: router_1.protectedProcedure
        .input(zod_1.default.void())
        //.output(APIResponseSchema(z.array(PostSchema)))
        .query(async () => {
        const data = await prisma_1.dbContext.post.findMany({
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
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(PostSchema)))
        .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.post.findMany({
                skip: page_index,
                take: page_size,
                include: {
                    PostCurrentDetail: true,
                    PostImage: true,
                    PostType: true,
                    PostFeature: true,
                },
            }),
            prisma_1.dbContext.post.count(),
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
    byId: router_1.protectedProcedure
        .input(zod_1.default.object({
        Id: ZodUtils_1.RequiredString,
    }))
        //.output(APIResponseSchema(PostSchema.nullable()))
        .query(async ({ input }) => {
        const data = await prisma_1.dbContext.post.findFirst({
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
    publish: router_1.protectedProcedure
        .input(AddPost_schema_1.AddPostSchema)
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
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const AddImages = [];
        for (const { Base64Data, ...metadata } of PostImage ?? []) {
            if (metadata.Id) {
                AddImages.push(metadata);
            }
            else if (Base64Data != null) {
                await cloudinary_1.v2.uploader.upload(Base64Data, {
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
        const result = await prisma_1.dbContext.post.create({
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
    update: router_1.protectedProcedure
        .input(Post_schema_1.PostSchema)
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
        const result = await prisma_1.dbContext.post.update({
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
