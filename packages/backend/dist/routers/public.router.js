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
        .query(async (opt) => {
        const data = await prisma_1.dbContext.post.findMany({
            take: 5,
            include: {
                PostCurrentDetail: true,
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
                PostCurrentDetail: true,
                PostImage: true,
                PostType: true,
                PostFeature: true,
                PostStats: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(PostSchema).parseAsync({
        //   data,
        // });
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
});
