"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const Blog_schema_1 = require("../../schemas/Blog.schema");
const prisma_1 = require("../../utils/prisma");
const ZodUtils_1 = require("../../utils/ZodUtils");
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const server_1 = require("@trpc/server");
const router_1 = require("../router");
exports.BlogRouter = router_1.trpcRouter.router({
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(BlogSchema)))
        .query(async ({ ctx, input }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.blog.findMany({
                skip: page_index,
                take: page_size,
                include: {
                    BlogImage: true,
                    GlobalBlogType: true,
                },
                where: {
                    UserId: (await ctx).userId,
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
        // return await APIResponseSchema(z.array(BlogSchema)).parseAsync({
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
        //.output(APIResponseSchema(BlogSchema.nullable()))
        .query(async ({ ctx, input }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await prisma_1.dbContext.blog.findFirst({
            where: {
                Id: input.Id,
                UserId: (await ctx).userId,
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
    update: router_1.protectedProcedure
        .input(Blog_schema_1.BlogSchema.omit({ GlobalBlogType: true }))
        // .output(
        //   APIResponseSchema(
        //     BlogSchema.omit({
        //       BlogCurrentDetail: true,
        //       BlogFeature: true,
        //       BlogImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ input: { Id, BlogImage, ...rest } }) => {
        //if (ctx.userId == null) return null;
        const result = await prisma_1.dbContext.blog.update({
            where: {
                Id,
            },
            data: {
                ...rest,
                BlogImage: {
                    connectOrCreate: BlogImage?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
            },
            include: {
                BlogImage: true,
                GlobalBlogType: true,
            },
        });
        return { data: result };
        // return await APIResponseSchema(
        //   BlogSchema.omit({
        //     BlogCurrentDetail: true,
        //     BlogFeature: true,
        //     BlogImage: true,
        //   }).nullable()
        // ).parseAsync({ data: result });
    }),
});
