"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftPostRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const DraftPost_schema_1 = require("../../schemas/DraftPost.schema");
const prisma_1 = require("../../utils/prisma");
const ZodUtils_1 = require("../../utils/ZodUtils");
const AddDraftPost_schema_1 = require("../../schemas/AddDraftPost.schema");
const server_1 = require("@trpc/server");
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const router_1 = require("../router");
exports.DraftPostRouter = router_1.trpcRouter.router({
    all: router_1.protectedProcedure
        .input(zod_1.default.void())
        //.output(APIResponseSchema(z.array(DraftPostSchema)))
        .query(async (opt) => {
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
        // return await APIResponseSchema(z.array(DraftPostSchema)).parseAsync({
        //   data,
        // });
    }),
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(DraftPostSchema)))
        .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.draftPost.findMany({
                skip: page_index,
                take: page_size,
                include: {
                    DraftPostCurrentDetail: true,
                    DraftPostImage: true,
                    DraftPostFeature: true,
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
        // return await APIResponseSchema(z.array(DraftPostSchema)).parseAsync({
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
        //.output(APIResponseSchema(DraftPostSchema.nullable()))
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
        // return await APIResponseSchema(DraftPostSchema.nullable()).parseAsync({
        //   data,
        // });
    }),
    create: router_1.protectedProcedure
        .input(AddDraftPost_schema_1.AddDraftPostSchema)
        // .output(
        //   APIResponseSchema(
        //     DraftPostSchema.omit({
        //       DraftPostCurrentDetail: true,
        //       DraftPostFeature: true,
        //       DraftPostImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { DraftPostCurrentDetail, DraftPostFeature, DraftPostImage, ...rest }, }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await prisma_1.dbContext.draftPost.create({
            data: {
                ...rest,
                UserId: (await ctx).userId ?? "",
                DraftPostCurrentDetail: {
                    createMany: {
                        data: DraftPostCurrentDetail,
                    },
                    // connectOrCreate: DraftPostCurrentDetail?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                },
                DraftPostFeature: {
                    createMany: {
                        data: DraftPostFeature,
                    },
                    // connectOrCreate: DraftPostFeature?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                },
                DraftPostImage: {
                    createMany: {
                        data: DraftPostImage,
                    },
                    // connectOrCreate: DraftPostImage?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                },
            },
        });
        return { data };
        // return await APIResponseSchema(
        //   DraftPostSchema.omit({
        //     DraftPostCurrentDetail: true,
        //     DraftPostFeature: true,
        //     DraftPostImage: true,
        //   }).nullable()
        // ).parseAsync({ data });
    }),
    update: router_1.protectedProcedure
        .input(DraftPost_schema_1.DraftPostSchema.omit({ GlobalPostType: true }))
        // .output(
        //   APIResponseSchema(
        //     DraftPostSchema.omit({
        //       DraftPostCurrentDetail: true,
        //       DraftPostFeature: true,
        //       DraftPostImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { Id, DraftPostCurrentDetail, DraftPostFeature, DraftPostImage, ...rest }, }) => {
        //if (ctx.userId == null) return null;
        const result = await prisma_1.dbContext.draftPost.update({
            where: {
                Id,
            },
            data: {
                ...rest,
                DraftPostCurrentDetail: {
                    connectOrCreate: DraftPostCurrentDetail?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
                DraftPostFeature: {
                    connectOrCreate: DraftPostFeature?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
                DraftPostImage: {
                    connectOrCreate: DraftPostImage?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
            },
        });
        return { data: result };
        // return await APIResponseSchema(
        //   DraftPostSchema.omit({
        //     DraftPostCurrentDetail: true,
        //     DraftPostFeature: true,
        //     DraftPostImage: true,
        //   })
        // ).parseAsync({ data: result });
    }),
    delete: router_1.protectedProcedure
        .input(zod_1.default.object({ Id: ZodUtils_1.RequiredString }))
        //.output(APIResponseSchema(OptionalBoolean.nullable()))
        .mutation(async ({ ctx, input: { Id } }) => {
        //if (ctx.userId == null) return null;
        const result = await prisma_1.dbContext.draftPost.delete({
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
