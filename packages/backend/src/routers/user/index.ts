import { trpcRouter } from "../router";
import { DraftPostRouter } from "./draft_post.router";
import { GlobalPostDetailRouter } from "./global_post_detail.router";
import { GlobalPostTypeRouter } from "./global_post_type.router";
import { PostRouter } from "./post.router";

export const userRouter = trpcRouter.router({
  post: PostRouter,
  draft_post: DraftPostRouter,
  global_post_type: GlobalPostTypeRouter,
  global_post_detail: GlobalPostDetailRouter,
});

export type TypeUserRouter = typeof userRouter;