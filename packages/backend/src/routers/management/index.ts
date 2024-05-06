import { z } from "zod";
import { publicProcedure, trpcRouter } from "../router.js";
import { DraftPostRouter } from "./draft_post.router.js";
import { GlobalPostDetailRouter } from "./global_post_detail.router.js";
import { GlobalPostTypeRouter } from "./global_post_type.router.js";
import { PostRouter } from "./post.router.js";
import { AdminUserRouter } from "./user.router.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { BlogRouter } from "./blog.router.js";
import { DraftBlogRouter } from "./draft_blog.router.js";
import { GlobalBlogTypeRouter } from "./global_blog_type.router.js";
import { PendingBlogRouter } from "./pending_blog.router.js";
import { PendingPostRouter } from "./pending_post.router.js";

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
  verifyRoles: publicProcedure
    .input(
      z.object({
        role_ids: z.array(RequiredString),
      })
    )
    .query(async ({ ctx, input: { role_ids } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      if (role_ids == null || role_ids.length <= 0)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: ``,
        });

      try {
        const response = await axios<
          {
            id: string;
            name: string;
            description: string;
          }[]
        >({
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
      } catch (error) {
        console.log({ error });
        return { data: false };
      }
    }),
});

export type TypeManagementRouter = typeof managementRouter;
