"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPostTypeRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../../utils/prisma");
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
});
