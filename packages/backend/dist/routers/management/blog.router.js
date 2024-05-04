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
const AddBlog_schema_1 = require("../../schemas/AddBlog.schema");
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const server_1 = require("@trpc/server");
const router_1 = require("../router");
const axios_1 = __importDefault(require("axios"));
exports.BlogRouter = router_1.trpcRouter.router({
    all: router_1.protectedProcedure
        .input(zod_1.default.void())
        //.output(APIResponseSchema(z.array(BlogSchema)))
        .query(async () => {
        const data = await prisma_1.dbContext.blog.findMany({
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
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(BlogSchema)))
        .query(async ({ input }) => {
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
        .query(async ({ input }) => {
        const data = await prisma_1.dbContext.blog.findFirst({
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
    publish: router_1.protectedProcedure
        .input(AddBlog_schema_1.AddBlogSchema)
        // .output(
        //   APIResponseSchema(
        //     BlogSchema.omit({
        //       BlogCurrentDetail: true,
        //       BlogFeature: true,
        //       BlogImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { BlogImage, ...rest } }) => {
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
        if (user == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const result = await prisma_1.dbContext.blog.create({
            data: {
                ...rest,
                UserId: (await ctx).userId ?? "",
                BlogImage: {
                    // connectOrCreate: BlogImage?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                    createMany: {
                        data: BlogImage ?? [],
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
        // return await APIResponseSchema(
        //   BlogSchema.omit({
        //     BlogCurrentDetail: true,
        //     BlogFeature: true,
        //     BlogImage: true,
        //   }).nullable()
        // ).parseAsync({ data: result });
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
                BlogStats: true,
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
