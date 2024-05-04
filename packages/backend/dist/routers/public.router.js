"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../utils/prisma");
const router_1 = require("./router");
const ZodUtils_1 = require("../utils/ZodUtils");
exports.PublicRouter = router_1.trpcRouter.router({
    topPost: router_1.publicProcedure
        .input(zod_1.default.void())
        //.output(APIResponseSchema(z.array(PostSchema)))
        .query(async () => {
        const data = await prisma_1.dbContext.post.findMany({
            take: 5,
            include: {
                PostCurrentDetail: {
                    include: {
                        PostDetail: true,
                    },
                },
                PostImage: true,
                PostType: true,
                PostFeature: true,
                PostStats: {
                    orderBy: {
                        ViewCount: "desc",
                    },
                },
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(z.array(PostSchema)).parseAsync({
        //   data,
        // });
    }),
    topPosts: router_1.publicProcedure.input(zod_1.default.void()).query(async () => {
        const data = await prisma_1.dbContext.post.findMany({
            take: 5,
            include: {
                PostImage: true,
                PostFeature: true,
                PostType: true,
                Auth0Profile: true,
                PostCurrentDetail: true,
                PostStats: {
                    orderBy: {
                        ViewCount: "desc",
                    },
                },
            },
        });
        return { data };
    }),
    getPostById: router_1.publicProcedure
        .input(zod_1.default.object({
        id: ZodUtils_1.RequiredString,
    }))
        //.output(APIResponseSchema(PostSchema))
        .query(async ({ input }) => {
        const data = await prisma_1.dbContext.post.findFirst({
            where: {
                Id: input.id,
            },
            include: {
                PostCurrentDetail: {
                    include: {
                        PostDetail: true,
                    },
                },
                PostImage: true,
                PostType: true,
                PostFeature: true,
                PostStats: true,
                Auth0Profile: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(PostSchema).parseAsync({
        //   data,
        // });
    }),
    searchPosts: router_1.publicProcedure
        .input(zod_1.default.object({
        keyword: ZodUtils_1.OptionalString,
    }))
        //.output(APIResponseSchema(PostSchema))
        .query(async ({ input }) => {
        const response = await prisma_1.dbContext.post.findMany({
            include: {
                Auth0Profile: true,
                PostImage: true,
                PostFeature: true,
                PostType: true,
                PostCurrentDetail: true,
                PostStats: true,
            },
            where: {
                OR: [
                    {
                        Title: {
                            contains: input.keyword,
                        },
                    },
                    {
                        Description: {
                            contains: input.keyword,
                        },
                    },
                ],
            },
            take: 20,
        });
        return { data: response };
    }),
    topBlogs: router_1.publicProcedure.input(zod_1.default.void()).query(async () => {
        const data = await prisma_1.dbContext.blog.findMany({
            take: 5,
            include: {
                BlogImage: true,
                BlogStats: {
                    orderBy: {
                        ViewCount: "desc",
                    },
                },
            },
        });
        return { data };
    }),
    getBlogById: 
    //.output(APIResponseSchema(PostSchema))
    router_1.publicProcedure
        .input(zod_1.default.object({
        id: ZodUtils_1.RequiredString,
    }))
        .query(async ({ input }) => {
        const data = await prisma_1.dbContext.blog.findFirst({
            where: {
                Id: input.id,
            },
            include: {
                BlogImage: true,
                GlobalBlogType: true,
                BlogStats: true,
                Auth0Profile: true,
            },
        });
        return {
            data,
        };
    }),
    searchBlogs: router_1.publicProcedure
        .input(zod_1.default.object({
        keyword: ZodUtils_1.OptionalString,
    }))
        //.output(APIResponseSchema(PostSchema))
        .query(async ({ input }) => {
        const response = await prisma_1.dbContext.blog.findMany({
            include: {
                Auth0Profile: true,
                BlogImage: true,
                GlobalBlogType: true,
            },
            where: {
                OR: [
                    {
                        Title: {
                            contains: input.keyword,
                        },
                    },
                    {
                        Description: {
                            contains: input.keyword,
                        },
                    },
                ],
            },
            take: 20,
        });
        return { data: response };
    }),
});
