"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.t = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const prisma_1 = require("../utils/prisma");
const AddPost_schema_1 = require("../schemas/AddPost.schema");
exports.t = server_1.initTRPC.context().create();
// Access as /user.getUser
exports.appRouter = exports.t.router({
    user: exports.t.router({
        getAllUser: exports.t.procedure.query((opt) => { }),
        getUser: exports.t.procedure.input(zod_1.z.string()).query((opts) => {
            return { id: opts.input, name: "Bilbo" };
        }),
        createUser: exports.t.procedure
            .input(zod_1.z.object({ name: zod_1.z.string().min(5) }))
            .mutation(async (opts) => {
            // use your ORM of choice
            return "Test";
        }),
    }),
    post: exports.t.router({
        all: exports.t.procedure.query(async (opt) => {
            const data = await prisma_1.dbContext.post.findMany({
                include: {
                    PostCurrentDetail: true,
                    PostImage: true,
                    PostType: true,
                },
            });
            return data;
        }),
        byId: exports.t.procedure.input(zod_1.z.string()).query(async ({ input }) => {
            const data = await prisma_1.dbContext.post.findFirst({
                where: {
                    Id: input,
                },
                include: {
                    PostCurrentDetail: true,
                    PostImage: true,
                    PostType: true,
                },
            });
            return data;
        }),
        add: exports.t.procedure
            .input(AddPost_schema_1.AddPostSchema)
            .mutation(async ({ ctx, input: { PostCurrentDetail, PostFeature, PostImage, ...rest }, }) => {
            if (ctx.userId == null)
                return null;
            const result = await prisma_1.dbContext.post.create({
                data: {
                    ...rest,
                    UserId: ctx.userId,
                    PostCurrentDetail: {
                        connectOrCreate: PostCurrentDetail?.map((item) => ({
                            where: {
                                Id: item.Id,
                            },
                            create: item,
                        })),
                    },
                    PostFeature: {
                        connectOrCreate: PostFeature?.map((item) => ({
                            where: {
                                Id: item.Id,
                            },
                            create: item,
                        })),
                    },
                    PostImage: {
                        connectOrCreate: PostImage?.map((item) => ({
                            where: {
                                Id: item.Id,
                            },
                            create: item,
                        })),
                    },
                },
            });
            return result;
        }),
    }),
});
