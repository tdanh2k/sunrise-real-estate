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
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(DraftPostSchema)))
        .query(async ({ ctx, input }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.draftPost.findMany({
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
        const data = await prisma_1.dbContext.draftPost.findFirst({
            where: {
                Id: input.Id,
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
        //     })
        //       .extend({
        //         Price: NonNegativeNumber.optional(),
        //       })
        //       .nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { Id, DraftPostCurrentDetail, DraftPostFeature, DraftPostImage, ...rest }, }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await prisma_1.dbContext.draftPost.upsert({
            create: {
                ...rest,
                UserId: (await ctx).userId ?? "",
                DraftPostCurrentDetail: {
                    createMany: {
                        data: DraftPostCurrentDetail,
                    },
                },
                DraftPostFeature: {
                    createMany: {
                        data: DraftPostFeature,
                    },
                },
                DraftPostImage: {
                    createMany: {
                        data: DraftPostImage,
                    },
                },
            },
            update: {
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
            where: {
                Id: Id ?? "00000000-0000-0000-0000-000000000000",
                UserId: (await ctx).userId,
            },
        });
        // const data = await dbContext.draftPost.create({
        //   data: {
        //     ...rest,
        //     UserId: (await ctx).userId ?? "",
        //     DraftPostCurrentDetail: {
        //       createMany: {
        //         data: DraftPostCurrentDetail,
        //       },
        //       // connectOrCreate: DraftPostCurrentDetail?.map((item) => ({
        //       //   where: {
        //       //     Id: item.Id,
        //       //   },
        //       //   create: item,
        //       // })),
        //     },
        //     DraftPostFeature: {
        //       createMany: {
        //         data: DraftPostFeature,
        //       },
        //       // connectOrCreate: DraftPostFeature?.map((item) => ({
        //       //   where: {
        //       //     Id: item.Id,
        //       //   },
        //       //   create: item,
        //       // })),
        //     },
        //     DraftPostImage: {
        //       createMany: {
        //         data: DraftPostImage,
        //       },
        //       // connectOrCreate: DraftPostImage?.map((item) => ({
        //       //   where: {
        //       //     Id: item.Id,
        //       //   },
        //       //   create: item,
        //       // })),
        //     },
        //   },
        // });
        return { data };
        // return await APIResponseSchema(
        //   DraftPostSchema.omit({
        //     DraftPostCurrentDetail: true,
        //     DraftPostFeature: true,
        //     DraftPostImage: true,
        //   })
        //     .extend({
        //       Price: NonNegativeNumber.optional(),
        //     })
        //     .nullable()
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
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const result = await prisma_1.dbContext.draftPost.update({
            where: {
                Id: Id ?? "00000000-0000-0000-0000-000000000000",
                UserId: (await ctx).userId,
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
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const result = await prisma_1.dbContext.draftPost.delete({
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