"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingBlogRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../../utils/prisma");
const ZodUtils_1 = require("../../utils/ZodUtils");
const server_1 = require("@trpc/server");
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const router_1 = require("../router");
const AddDraftBlog_schema_1 = require("../../schemas/AddDraftBlog.schema");
const cloudinary_1 = require("cloudinary");
exports.PendingBlogRouter = router_1.trpcRouter.router({
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(PendingBlogSchema)))
        .query(async ({ ctx, input }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.pendingBlog.findMany({
                where: {
                    UserId: (await ctx).userId,
                },
                skip: page_index,
                take: page_size,
                include: {
                    PendingBlogImage: true,
                    GlobalBlogType: true,
                },
            }),
            prisma_1.dbContext.blog.count(),
        ]);
        return {
            data,
            paging: {
                page_index,
                page_size,
                row_count,
            },
        };
        // return await APIResponseSchema(z.array(PendingBlogSchema)).parseAsync({
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
        //.output(APIResponseSchema(PendingBlogSchema.nullable()))
        .query(async ({ input }) => {
        const data = await prisma_1.dbContext.pendingBlog.findFirst({
            where: {
                Id: input.Id,
            },
            include: {
                PendingBlogImage: true,
                GlobalBlogType: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(PendingBlogSchema.nullable()).parseAsync({
        //   data,
        // });
    }),
    createFromDraft: router_1.protectedProcedure
        .input(AddDraftBlog_schema_1.AddDraftBlogSchema.omit({ GlobalBlogType: true }))
        .mutation(async ({ ctx, input: { Id, DraftBlogImage, ...rest } }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const AddImages = [];
        for (const { Base64Data, ...metadata } of DraftBlogImage) {
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
                            Path: result?.secure_url,
                            Size: result?.bytes ?? metadata?.Size,
                        });
                });
            }
        }
        const [createdPendingBlog] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.pendingBlog.create({
                data: {
                    ...rest,
                    UserId: (await ctx).userId ?? "",
                    TypeId: rest.TypeId ?? "",
                    Description: rest.Description ?? "",
                    PendingBlogImage: {
                        // createMany: {
                        //   data: DraftBlogImage?.map((item) => ({
                        //     ...item,
                        //     Id: undefined,
                        //   })),
                        // },
                        connectOrCreate: AddImages?.map((item) => ({
                            create: item,
                            where: {
                                Id: item?.Id ?? "00000000-0000-0000-0000-000000000000",
                            },
                        })),
                    },
                },
            }),
            prisma_1.dbContext.draftBlog.delete({
                where: {
                    Id: Id ?? "00000000-0000-0000-0000-000000000000",
                    UserId: (await ctx).userId ?? "",
                },
                // include: {
                //   DraftBlogImage: true,
                //   GlobalBlogType: true,
                // },
            }),
        ]);
        return { data: createdPendingBlog };
    }),
    approve: router_1.protectedProcedure
        .input(zod_1.default.object({
        Id: ZodUtils_1.RequiredString,
    }))
        // .output(
        //   APIResponseSchema(
        //     PendingBlogSchema.omit({
        //       PendingCurrentDetail: true,
        //       PendingFeature: true,
        //       PendingBlogImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { Id } }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await prisma_1.dbContext.pendingBlog.findFirst({
            where: {
                Id,
            },
            include: {
                PendingBlogImage: true,
            },
        });
        // const response = await axios<TypeAuth0User>({
        //   url: `${(await ctx).domain}api/v2/users/${(await ctx).userId}`,
        //   method: "GET",
        //   params: {
        //     search_engine: "v3",
        //   },
        //   headers: {
        //     Authorization: `Bearer ${(await ctx).management_token}`,
        //   },
        // });
        // const user = response?.data;
        const [updatedPendingBlog] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.pendingBlog.update({
                data: {
                    ApprovedBy: (await ctx).userId,
                    ApprovedDate: new Date(),
                },
                where: {
                    Id,
                },
            }),
            prisma_1.dbContext.blog.create({
                data: {
                    Idx: data?.Idx,
                    Code: data?.Code,
                    Title: data?.Title ?? "",
                    Description: data?.Description ?? "",
                    Address: data?.Address ?? "",
                    TypeId: data?.TypeId ?? "",
                    UserId: data?.UserId ?? (await ctx).userId ?? "",
                    BlogImage: {
                        createMany: {
                            data: data?.PendingBlogImage?.map((item) => ({
                                ...item,
                                PendingBlogId: undefined,
                            })) ?? [],
                        },
                    },
                },
            }),
        ]);
        return {
            data: updatedPendingBlog,
        };
        // return await APIResponseSchema(
        //   PendingBlogSchema.omit({
        //     PendingCurrentDetail: true,
        //     PendingFeature: true,
        //     PendingBlogImage: true,
        //   }).nullable()
        // ).parseAsync({ data });
    }),
    reject: router_1.protectedProcedure
        .input(zod_1.default.object({
        Id: ZodUtils_1.RequiredString,
    }))
        // .output(
        //   APIResponseSchema(
        //     PendingBlogSchema.omit({
        //       PendingCurrentDetail: true,
        //       PendingFeature: true,
        //       PendingBlogImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { Id } }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await prisma_1.dbContext.pendingBlog.findFirst({
            where: {
                Id,
            },
            include: {
                PendingBlogImage: true,
            },
        });
        const [, pendingBlog] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.draftBlog.create({
                data: {
                    Idx: data?.Idx,
                    Code: data?.Code ?? "",
                    Title: data?.Title ?? "",
                    Description: data?.Description ?? "",
                    TypeId: data?.TypeId ?? "",
                    UserId: data?.UserId ?? "",
                    DraftBlogImage: {
                        createMany: {
                            data: data?.PendingBlogImage?.map((item) => ({
                                ...item,
                                PendingBlogId: undefined,
                            })) ?? [],
                        },
                    },
                },
            }),
            prisma_1.dbContext.pendingBlog.delete({
                where: {
                    Id,
                },
            }),
        ]);
        return { data: pendingBlog };
        // return await APIResponseSchema(
        //   PendingBlogSchema.omit({
        //     PendingCurrentDetail: true,
        //     PendingFeature: true,
        //     PendingBlogImage: true,
        //   }).nullable()
        // ).parseAsync({ data: pendingBlog });
    }),
});
