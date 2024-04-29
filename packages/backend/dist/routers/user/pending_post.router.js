"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingPostRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../../utils/prisma");
const ZodUtils_1 = require("../../utils/ZodUtils");
const server_1 = require("@trpc/server");
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const router_1 = require("../router");
const axios_1 = __importDefault(require("axios"));
const AddDraftPost_schema_1 = require("../../schemas/AddDraftPost.schema");
exports.PendingPostRouter = router_1.trpcRouter.router({
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(PendingPostSchema)))
        .query(async ({ ctx, input }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.pendingPost.findMany({
                where: {
                    UserId: (await ctx).userId,
                },
                skip: page_index,
                take: page_size,
                include: {
                    PendingPostCurrentDetail: true,
                    PendingPostImage: true,
                    PendingPostFeature: true,
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
        // return await APIResponseSchema(z.array(PendingPostSchema)).parseAsync({
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
        //.output(APIResponseSchema(PendingPostSchema.nullable()))
        .query(async ({ input }) => {
        const data = await prisma_1.dbContext.pendingPost.findFirst({
            where: {
                Id: input.Id,
            },
            include: {
                PendingPostCurrentDetail: true,
                PendingPostImage: true,
                GlobalPostType: true,
                PendingPostFeature: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(PendingPostSchema.nullable()).parseAsync({
        //   data,
        // });
    }),
    createFromDraft: router_1.protectedProcedure
        .input(AddDraftPost_schema_1.AddDraftPostSchema)
        .mutation(async ({ ctx, input: { Id, DraftPostCurrentDetail, DraftPostFeature, DraftPostImage, ...rest }, }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const response = await (0, axios_1.default)({
            url: `${(await ctx).domain}api/v2/users/${(await ctx).userId}`,
            method: "GET",
            params: {
                search_engine: "v3",
            },
            headers: {
                Authorization: `Bearer ${(await ctx).management_token}`,
            },
        });
        const user = response?.data;
        const [createdPendingPost] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.pendingPost.create({
                data: {
                    ...rest,
                    UserId: (await ctx).userId ?? "",
                    User_Email: user.email,
                    User_EmailVerified: user.email_verified,
                    User_Name: user.name,
                    User_Username: user.username,
                    User_PhoneNumber: user.phone_number,
                    User_PhoneVerified: user.phone_verified,
                    User_Picture: user.picture,
                    PendingPostCurrentDetail: {
                        createMany: {
                            data: DraftPostCurrentDetail?.map((item) => ({
                                ...item,
                                Id: undefined,
                            })),
                        },
                    },
                    PendingPostFeature: {
                        createMany: {
                            data: DraftPostFeature?.map((item) => ({
                                ...item,
                                Id: undefined,
                            })),
                        },
                    },
                    PendingPostImage: {
                        createMany: {
                            data: DraftPostImage?.map((item) => ({
                                ...item,
                                Id: undefined,
                            })),
                        },
                    },
                },
            }),
            prisma_1.dbContext.draftPost.delete({
                where: {
                    Id: Id ?? "00000000-0000-0000-0000-000000000000",
                    UserId: (await ctx).userId ?? "",
                },
                include: {
                    DraftPostCurrentDetail: true,
                    DraftPostFeature: true,
                    DraftPostImage: true,
                },
            }),
        ]);
        return { data: createdPendingPost };
    }),
    approve: router_1.protectedProcedure
        .input(zod_1.default.object({
        Id: ZodUtils_1.RequiredString,
    }))
        // .output(
        //   APIResponseSchema(
        //     PendingPostSchema.omit({
        //       PendingCurrentDetail: true,
        //       PendingFeature: true,
        //       PendingPostImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { Id } }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await prisma_1.dbContext.pendingPost.findFirst({
            where: {
                Id,
            },
            include: {
                PendingPostCurrentDetail: true,
                PendingPostFeature: true,
                PendingPostImage: true,
            },
        });
        const response = await (0, axios_1.default)({
            url: `${(await ctx).domain}api/v2/users/${(await ctx).userId}`,
            method: "GET",
            params: {
                search_engine: "v3",
            },
            headers: {
                Authorization: `Bearer ${(await ctx).management_token}`,
            },
        });
        const user = response?.data;
        const [updatedPendingPost, createdPost] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.pendingPost.update({
                data: {
                    ApprovedBy: (await ctx).userId,
                    ApprovedDate: new Date(),
                },
                where: {
                    Id,
                },
            }),
            prisma_1.dbContext.post.create({
                data: {
                    Idx: data?.Idx,
                    Code: data?.Code,
                    Title: data?.Title ?? "",
                    Description: data?.Description ?? "",
                    Address: data?.Address ?? "",
                    MapUrl: data?.MapUrl ?? "",
                    Price: data?.Price,
                    TypeId: data?.TypeId ?? "",
                    UserId: data?.UserId ?? (await ctx).userId ?? "",
                    User_Email: user.email,
                    User_EmailVerified: user.email_verified,
                    User_Name: user.name,
                    User_Username: user.username,
                    User_PhoneNumber: user.phone_number,
                    User_PhoneVerified: user.phone_verified,
                    User_Picture: user.picture,
                    PostCurrentDetail: {
                        createMany: {
                            data: data?.PendingPostCurrentDetail?.map((item) => ({
                                ...item,
                                PendingPostId: undefined,
                            })) ?? [],
                        },
                    },
                    PostFeature: {
                        createMany: {
                            data: data?.PendingPostFeature?.map((item) => ({
                                ...item,
                                Description: item.Description ?? "",
                                PendingPostId: undefined,
                            })) ?? [],
                        },
                    },
                    PostImage: {
                        createMany: {
                            data: data?.PendingPostImage?.map((item) => ({
                                ...item,
                                PendingPostId: undefined,
                            })) ?? [],
                        },
                    },
                },
            }),
        ]);
        return {
            data: updatedPendingPost,
        };
        // return await APIResponseSchema(
        //   PendingPostSchema.omit({
        //     PendingCurrentDetail: true,
        //     PendingFeature: true,
        //     PendingPostImage: true,
        //   }).nullable()
        // ).parseAsync({ data });
    }),
    reject: router_1.protectedProcedure
        .input(zod_1.default.object({
        Id: ZodUtils_1.RequiredString,
    }))
        // .output(
        //   APIResponseSchema(
        //     PendingPostSchema.omit({
        //       PendingCurrentDetail: true,
        //       PendingFeature: true,
        //       PendingPostImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { Id } }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await prisma_1.dbContext.pendingPost.findFirst({
            where: {
                Id,
            },
            include: {
                PendingPostCurrentDetail: true,
                PendingPostFeature: true,
                PendingPostImage: true,
            },
        });
        const [, pendingPost] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.draftPost.create({
                data: {
                    Idx: data?.Idx,
                    Code: data?.Code,
                    Title: data?.Title ?? "",
                    Description: data?.Description ?? "",
                    Address: data?.Address ?? "",
                    MapUrl: data?.MapUrl ?? "",
                    Price: data?.Price,
                    TypeId: data?.TypeId ?? "",
                    UserId: data?.UserId ?? (await ctx).userId ?? "",
                    DraftPostCurrentDetail: {
                        createMany: {
                            data: data?.PendingPostCurrentDetail?.map((item) => ({
                                ...item,
                                PendingPostId: undefined,
                            })) ?? [],
                        },
                    },
                    DraftPostFeature: {
                        createMany: {
                            data: data?.PendingPostFeature?.map((item) => ({
                                ...item,
                                Description: item.Description ?? "",
                                PendingPostId: undefined,
                            })) ?? [],
                        },
                    },
                    DraftPostImage: {
                        createMany: {
                            data: data?.PendingPostImage?.map((item) => ({
                                ...item,
                                PendingPostId: undefined,
                            })) ?? [],
                        },
                    },
                },
            }),
            prisma_1.dbContext.pendingPost.delete({
                where: {
                    Id,
                },
                include: {
                    PendingPostCurrentDetail: true,
                    PendingPostFeature: true,
                    PendingPostImage: true,
                },
            }),
        ]);
        return { data: pendingPost };
        // return await APIResponseSchema(
        //   PendingPostSchema.omit({
        //     PendingCurrentDetail: true,
        //     PendingFeature: true,
        //     PendingPostImage: true,
        //   }).nullable()
        // ).parseAsync({ data: pendingPost });
    }),
});
