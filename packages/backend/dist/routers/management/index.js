import { publicProcedure, trpcRouter } from "../router.js";
import { DraftPostRouter } from "./draft_post.router.js";
import { GlobalPostDetailRouter } from "./global_post_detail.router.js";
import { GlobalPostTypeRouter } from "./global_post_type.router.js";
import { PostRouter } from "./post.router.js";
import { AdminUserRouter } from "./user.router.js";
import { TRPCError } from "@trpc/server";
import { BlogRouter } from "./blog.router.js";
import { DraftBlogRouter } from "./draft_blog.router.js";
import { GlobalBlogTypeRouter } from "./global_blog_type.router.js";
import { PendingBlogRouter } from "./pending_blog.router.js";
import { PendingPostRouter } from "./pending_post.router.js";
import { auth0Management } from "../../app.js";
export const managementRouter = trpcRouter.router({
    post: PostRouter,
    draft_post: DraftPostRouter,
    pending_post: PendingPostRouter,
    global_post_type: GlobalPostTypeRouter,
    global_post_detail: GlobalPostDetailRouter,
    admin_user: AdminUserRouter,
    blog: BlogRouter,
    draft_blog: DraftBlogRouter,
    pending_blog: PendingBlogRouter,
    global_blog_type: GlobalBlogTypeRouter,
    getCurrentUserRoles: publicProcedure.query(async ({ ctx }) => {
        if ((await ctx).userId == null)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const response = await auth0Management.users.getRoles({
            id: (await ctx).userId ?? "",
        });
        return {
            data: response?.data,
        };
    }),
});
