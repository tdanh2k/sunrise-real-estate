import { z } from "zod";
import { publicProcedure, trpcRouter } from "../router";
import { DraftPostRouter } from "./draft_post.router";
import { GlobalPostDetailRouter } from "./global_post_detail.router";
import { GlobalPostTypeRouter } from "./global_post_type.router";
import { PostRouter } from "./post.router";
import { AdminUserRouter } from "./user.router";
import { RequiredString } from "../../utils/ZodUtils";
import { TRPCError } from "@trpc/server";
import axios from "axios";

export const managementRouter = trpcRouter.router({
  post: PostRouter,
  draft_post: DraftPostRouter,
  global_post_type: GlobalPostTypeRouter,
  global_post_detail: GlobalPostDetailRouter,
  admin_user: AdminUserRouter,
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
