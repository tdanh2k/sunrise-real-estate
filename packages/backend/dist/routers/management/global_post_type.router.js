"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPostTypeRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../../utils/prisma");
const AddGlobalPostType_schema_1 = require("../../schemas/AddGlobalPostType.schema");
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const router_1 = require("../router");
exports.GlobalPostTypeRouter = router_1.trpcRouter.router({
    all: router_1.protectedProcedure
        .input(zod_1.default.void())
        //.output(APIResponseSchema(z.array(GlobalPostTypeSchema)))
        .query(async () => {
        const data = await prisma_1.dbContext.globalPostType.findMany();
        return {
            data,
        };
        // return await APIResponseSchema(z.array(GlobalPostTypeSchema)).parseAsync({
        //   data,
        // });
    }),
    nextIdx: router_1.protectedProcedure
        .input(zod_1.default.void())
        // .output(
        //   APIResponseSchema(z.object({ Idx: NonNegativeIntegerNumber.nullable() }))
        // )
        .query(async () => {
        const data = await prisma_1.dbContext.globalPostType.aggregate({
            _max: {
                Idx: true,
            },
        });
        const result = {
            Idx: data?._max?.Idx + 1 ?? 1,
        };
        return { data: result };
        // return await APIResponseSchema(
        //   z.object({ Idx: NonNegativeIntegerNumber.nullable() })
        // ).parseAsync({ data: result });
    }),
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        //.output(APIResponseSchema(z.array(GlobalPostTypeSchema)))
        .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 0;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await prisma_1.dbContext.$transaction([
            prisma_1.dbContext.globalPostType.findMany({
                skip: page_index,
                take: page_size,
            }),
            prisma_1.dbContext.globalPostType.count(),
        ]);
        return {
            data,
            paging: {
                page_index,
                page_size,
                row_count,
            },
        };
        // return await APIResponseSchema(z.array(GlobalPostTypeSchema)).parseAsync({
        //   data,
        //   paging: {
        //     page_index,
        //     page_size,
        //     row_count,
        //   },
        // });
    }),
    create: router_1.protectedProcedure
        .input(AddGlobalPostType_schema_1.AddGlobalPostTypeSchema)
        //.output(APIResponseSchema(GlobalPostTypeSchema.nullable()))
        .mutation(async ({ input }) => {
        //if (ctx.userId == null) return null;
        const data = await prisma_1.dbContext.globalPostType.create({
            data: input,
        });
        return { data };
        // return await APIResponseSchema(
        //   GlobalPostTypeSchema.nullable()
        // ).parseAsync({ data });
    }),
});
