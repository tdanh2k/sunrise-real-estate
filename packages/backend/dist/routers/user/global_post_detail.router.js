"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPostDetailRouter = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../../utils/prisma");
const router_1 = require("../router");
exports.GlobalPostDetailRouter = router_1.trpcRouter.router({
    all: router_1.protectedProcedure
        .input(zod_1.default.void())
        //.output(APIResponseSchema(z.array(GlobalPostDetailSchema)))
        .query(async () => {
        const data = await prisma_1.dbContext.globalPostDetail.findMany();
        return { data };
        // return await APIResponseSchema(
        //   z.array(GlobalPostDetailSchema)
        // ).parseAsync({ data });
    }),
});
