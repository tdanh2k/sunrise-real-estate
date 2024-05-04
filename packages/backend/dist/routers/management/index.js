"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managementRouter = void 0;
const zod_1 = require("zod");
const router_1 = require("../router");
const draft_post_router_1 = require("./draft_post.router");
const global_post_detail_router_1 = require("./global_post_detail.router");
const global_post_type_router_1 = require("./global_post_type.router");
const post_router_1 = require("./post.router");
const user_router_1 = require("./user.router");
const ZodUtils_1 = require("../../utils/ZodUtils");
const server_1 = require("@trpc/server");
const axios_1 = __importDefault(require("axios"));
const blog_router_1 = require("./blog.router");
const draft_blog_router_1 = require("./draft_blog.router");
const global_blog_type_router_1 = require("./global_blog_type.router");
const pending_blog_router_1 = require("./pending_blog.router");
const pending_post_router_1 = require("./pending_post.router");
exports.managementRouter = router_1.trpcRouter.router({
    post: post_router_1.PostRouter,
    draft_post: draft_post_router_1.DraftPostRouter,
    pending_post: pending_post_router_1.PendingPostRouter,
    global_post_type: global_post_type_router_1.GlobalPostTypeRouter,
    global_post_detail: global_post_detail_router_1.GlobalPostDetailRouter,
    admin_user: user_router_1.AdminUserRouter,
    blog: blog_router_1.BlogRouter,
    draft_blog: draft_blog_router_1.DraftBlogRouter,
    pending_blog: pending_blog_router_1.PendingBlogRouter,
    global_blog_type: global_blog_type_router_1.GlobalBlogTypeRouter,
    verifyRoles: router_1.publicProcedure
        .input(zod_1.z.object({
        role_ids: zod_1.z.array(ZodUtils_1.RequiredString),
    }))
        .query(async ({ ctx, input: { role_ids } }) => {
        if ((await ctx).userId == null)
            throw new server_1.TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        if (role_ids == null || role_ids.length <= 0)
            throw new server_1.TRPCError({
                code: "FORBIDDEN",
                message: ``,
            });
        try {
            const response = await (0, axios_1.default)({
                method: "GET",
                url: `${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent((await ctx).userId ?? "")}/roles`,
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${(await ctx).management_token}`,
                },
            });
            return {
                data: response?.data?.some((item) => role_ids?.includes(item.id)),
            };
        }
        catch (error) {
            console.log({ error });
            return { data: false };
        }
    }),
});
