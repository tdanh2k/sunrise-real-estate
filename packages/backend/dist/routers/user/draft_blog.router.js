"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftBlogRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const DraftBlog_schema_1 = require("../../schemas/DraftBlog.schema");
const prisma_1 = require("../../utils/prisma");
const ZodUtils_1 = require("../../utils/ZodUtils");
const AddDraftBlog_schema_1 = require("../../schemas/AddDraftBlog.schema");
const server_1 = require("@trpc/server");
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const router_1 = require("../router");
const cloudinary_1 = require("cloudinary");
exports.DraftBlogRouter = router_1.trpcRouter.router({
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(DraftBlogSchema)))
        .query(async ({ ctx, input }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.draftBlog.findMany({
                where: {
                    UserId: (await ctx).userId,
                },
                skip: page_index,
                take: page_size,
                include: {
                    DraftBlogImage: true,
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
        // return await APIResponseSchema(z.array(DraftBlogSchema)).parseAsync({
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
        //.output(APIResponseSchema(DraftBlogSchema.nullable()))
        .query(async ({ input }) => {
        const data = await prisma_1.dbContext.draftBlog.findFirst({
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
    create: router_1.protectedProcedure
        .input(AddDraftBlog_schema_1.AddDraftBlogSchema.omit({ GlobalBlogType: true }))
        // .output(
        //   APIResponseSchema(
        //     DraftBlogSchema.omit({
        //       DraftBlogCurrentDetail: true,
        //       DraftBlogFeature: true,
        //       DraftBlogImage: true,
        //     })
        //       .extend({
        //         Price: NonNegativeNumber.optional(),
        //       })
        //       .nullable()
        //   )
        // )
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
        const data = await prisma_1.dbContext.draftBlog.upsert({
            create: {
                ...rest,
                TypeId: rest.TypeId ?? "",
                Code: rest.Code ?? "",
                Title: rest.Title ?? "",
                Description: rest.Description ?? "",
                UserId: (await ctx).userId ?? "",
                DraftBlogImage: {
                    createMany: {
                        data: AddImages,
                    },
                },
            },
            update: {
                ...rest,
                DraftBlogImage: {
                    connectOrCreate: AddImages?.map((item) => ({
                        create: item,
                        where: {
                            Id: item.Id ?? "00000000-0000-0000-0000-000000000000",
                        },
                    })),
                    deleteMany: AddImages?.some((r) => r.Id)
                        ? {
                            Id: {
                                notIn: AddImages?.map((r) => r.Id),
                            },
                        }
                        : undefined,
                },
            },
            include: {
                DraftBlogImage: true,
                GlobalBlogType: true,
            },
            where: {
                Id: Id ?? "00000000-0000-0000-0000-000000000000",
                UserId: (await ctx).userId,
            },
        });
        return { data };
        // return await APIResponseSchema(
        //   DraftBlogSchema.omit({
        //     DraftBlogCurrentDetail: true,
        //     DraftBlogFeature: true,
        //     DraftBlogImage: true,
        //   })
        //     .extend({
        //       Price: NonNegativeNumber.optional(),
        //     })
        //     .nullable()
        // ).parseAsync({ data });
    }),
    update: router_1.protectedProcedure
        .input(DraftBlog_schema_1.DraftBlogSchema.omit({ GlobalBlogType: true }))
        // .output(
        //   APIResponseSchema(
        //     DraftBlogSchema.omit({
        //       DraftBlogCurrentDetail: true,
        //       DraftBlogFeature: true,
        //       DraftBlogImage: true,
        //     }).nullable()
        //   )
        // )
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
                            Path: result?.secure_url ?? "",
                            Size: result?.bytes ?? metadata?.Size,
                        });
                });
            }
        }
        // const result = await dbContext.draftBlog.update({
        //   where: {
        //     Id: Id ?? "00000000-0000-0000-0000-000000000000",
        //     UserId: (await ctx).userId,
        //   },
        //   include: {
        //     DraftBlogImage: true,
        //     GlobalBlogType: true,
        //   },
        //   data: {
        //     ...rest,
        //     DraftBlogImage: {
        //       connectOrCreate: AddImages?.map((item) => ({
        //         where: {
        //           Id: item.Id,
        //         },
        //         create: item,
        //       })),
        //       deleteMany: AddImages?.some((r) => r.Id)
        //         ? {
        //             Id: {
        //               notIn: AddImages?.map((r) => r.Id) as string[],
        //             },
        //           }
        //         : undefined,
        //     },
        //   },
        // });
        const [updatedDraftBlog, deletedImages, { count }] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.draftBlog.update({
                where: {
                    Id: Id ?? "00000000-0000-0000-0000-000000000000",
                    UserId: (await ctx).userId,
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
                        // deleteMany: AddImages?.some((r) => r.Id)
                        //   ? {
                        //       Id: {
                        //         notIn: AddImages?.map((r) => r.Id) as string[],
                        //       },
                        //     }
                        //   : undefined,
                    },
                },
            }),
            prisma_1.dbContext.draftBlogImage.findMany({
                where: {
                    Id: {
                        notIn: AddImages?.map((r) => r.Id),
                    },
                    DraftBlogId: Id,
                },
            }),
            prisma_1.dbContext.draftBlogImage.deleteMany({
                where: {
                    Id: {
                        notIn: AddImages?.map((r) => r.Id),
                    },
                    DraftBlogId: Id,
                },
            }),
        ]);
        if (deletedImages?.some((r) => r.Code) && count > 0) {
            await cloudinary_1.v2.api.delete_resources(deletedImages?.filter((r) => r.Code)?.map((r) => r.Code), { type: "upload", resource_type: "image" });
        }
        return { data: updatedDraftBlog };
        // return await APIResponseSchema(
        //   DraftBlogSchema.omit({
        //     DraftBlogCurrentDetail: true,
        //     DraftBlogFeature: true,
        //     DraftBlogImage: true,
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
        const [images, deletedDraftBlog] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.draftBlogImage.findMany({
                where: {
                    DraftBlogId: Id,
                    DraftBlog: {
                        UserId: (await ctx).userId,
                    },
                },
            }),
            prisma_1.dbContext.draftBlog.delete({
                where: {
                    Id: Id ?? "00000000-0000-0000-0000-000000000000",
                    UserId: (await ctx).userId,
                },
            }),
        ]);
        if (images?.some((r) => r.Code)) {
            await cloudinary_1.v2.api.delete_resources(images?.filter((r) => r.Code)?.map((r) => r.Code), { type: "upload", resource_type: "image" });
        }
        return {
            data: deletedDraftBlog,
        };
        // return await APIResponseSchema(OptionalBoolean.nullable()).parseAsync({
        //   data: Boolean(result),
        // });
    }),
});
