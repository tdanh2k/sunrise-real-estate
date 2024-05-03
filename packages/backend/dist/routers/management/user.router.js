"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserRouter = void 0;
const axios_1 = __importDefault(require("axios"));
const Pagination_schema_1 = require("../../schemas/Pagination.schema");
const router_1 = require("../router");
const APIResponse_schema_1 = require("../../schemas/APIResponse.schema");
const zod_1 = require("zod");
exports.AdminUserRouter = router_1.trpcRouter.router({
    byPage: router_1.protectedProcedure
        .input(Pagination_schema_1.PaginationSchema)
        .output((0, APIResponse_schema_1.APIResponseSchema)(zod_1.z.custom()))
        .query(async ({ ctx, input }) => {
        const response = await (0, axios_1.default)({
            url: `${(await ctx).domain}api/v2/users`,
            method: "GET",
            params: {
                search_engine: "v3",
                page: input.paging.page_index,
            },
            headers: {
                Authorization: `Bearer ${(await ctx).management_token}`,
            },
        });
        return await (0, APIResponse_schema_1.APIResponseSchema)(zod_1.z.custom()).parseAsync({
            data: response?.data,
        });
    }),
});
