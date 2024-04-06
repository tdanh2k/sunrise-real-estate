import { trpcRouter } from "../router";
import { DraftPostRouter } from "./draft_post.router";
import { GlobalPostDetailRouter } from "./global_post_detail.router";
import { GlobalPostTypeRouter } from "./global_post_type.router";
import { PostRouter } from "./post.router";
import { AdminUserRouter } from "./user.router";

export const managementRouter = trpcRouter.router({
  post: PostRouter,
  draft_post: DraftPostRouter,
  global_post_type: GlobalPostTypeRouter,
  global_post_detail: GlobalPostDetailRouter,
  admin_user: AdminUserRouter,
});

export type TypeManagementRouter = typeof managementRouter;
