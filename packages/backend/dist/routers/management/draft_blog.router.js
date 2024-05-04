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
exports.DraftBlogRouter = router_1.trpcRouter.router({
    all: router_1.protectedProcedure
        .input(zod_1.default.void())
        //.output(APIResponseSchema(z.array(DraftBlogSchema)))
        .query(async () => {
        const data = await prisma_1.dbContext.draftBlog.findMany({
            include: {
                DraftBlogImage: true,
                GlobalBlogType: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(z.array(DraftBlogSchema)).parseAsync({
        //   data,
        // });
    }),
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(DraftBlogSchema)))
        .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.draftBlog.findMany({
                skip: page_index,
                take: page_size,
                include: {
                    DraftBlogImage: true,
                    GlobalBlogType: true,
                },
            }),
            prisma_1.dbContext.draftBlog.count(),
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
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { DraftBlogImage, ...rest } }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await prisma_1.dbContext.draftBlog.create({
            data: {
                ...rest,
                Code: rest?.Code ?? "",
                Title: rest?.Title ?? "",
                Description: rest?.Description ?? "",
                TypeId: rest?.TypeId ?? "",
                UserId: (await ctx).userId ?? "",
                DraftBlogImage: {
                    createMany: {
                        data: DraftBlogImage,
                    },
                    // connectOrCreate: DraftBlogImage?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                },
            },
            include: {
                DraftBlogImage: true,
                GlobalBlogType: true,
            },
        });
        return { data };
        // return await APIResponseSchema(
        //   DraftBlogSchema.omit({
        //     DraftBlogCurrentDetail: true,
        //     DraftBlogFeature: true,
        //     DraftBlogImage: true,
        //   }).nullable()
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
        .mutation(async ({ input: { Id, DraftBlogImage, ...rest }, }) => {
        //if (ctx.userId == null) return null;
        const result = await prisma_1.dbContext.draftBlog.update({
            where: {
                Id,
            },
            data: {
                ...rest,
                DraftBlogImage: {
                    connectOrCreate: DraftBlogImage?.map((item) => ({
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
        .mutation(async ({ input: { Id } }) => {
        //if (ctx.userId == null) return null;
        const result = await prisma_1.dbContext.draftBlog.delete({
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
