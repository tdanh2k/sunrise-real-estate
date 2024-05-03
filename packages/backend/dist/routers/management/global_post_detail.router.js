"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPostDetailRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../../utils/prisma");
const AddGlobalPostDetail_schema_1 = require("../../schemas/AddGlobalPostDetail.schema");
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const router_1 = require("../router");
exports.GlobalPostDetailRouter = router_1.trpcRouter.router({
    all: router_1.protectedProcedure
        .input(zod_1.default.void())
        //.output(APIResponseSchema(z.array(GlobalPostDetailSchema)))
        .query(async (opt) => {
        const data = await prisma_1.dbContext.globalPostDetail.findMany();
        return { data };
        // return await APIResponseSchema(
        //   z.array(GlobalPostDetailSchema)
        // ).parseAsync({ data });
    }),
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(GlobalPostDetailSchema)))
        .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 0;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.globalPostDetail.findMany({
                skip: page_index,
                take: page_size,
            }),
            prisma_1.dbContext.globalPostDetail.count(),
        ]);
        return {
            data,
            paging: {
                page_index,
                page_size,
                row_count,
            },
        };
        // return await APIResponseSchema(
        //   z.array(GlobalPostDetailSchema)
        // ).parseAsync({
        //   data,
        //   paging: {
        //     page_index,
        //     page_size,
        //     row_count,
        //   },
        // });
    }),
    create: router_1.protectedProcedure
        .input(AddGlobalPostDetail_schema_1.AddGlobalPostDetailSchema)
        //.output(APIResponseSchema(GlobalPostDetailSchema.nullable()))
        .mutation(async ({ ctx, input }) => {
        //if (ctx.userId == null) return null;
        const data = await prisma_1.dbContext.globalPostDetail.create({
            data: input,
        });
        return { data };
        // return await APIResponseSchema(
        //   GlobalPostDetailSchema.nullable()
        // ).parseAsync({ data });
    }),
});
