import { trpcRouter } from "../router";
import { BlogRouter } from "./blog.router";
import { DraftBlogRouter } from "./draft_blog.router";
import { DraftPostRouter } from "./draft_post.router";
import { GlobalBlogTypeRouter } from "./global_blog_type.router";
import { GlobalPostDetailRouter } from "./global_post_detail.router";
import { GlobalPostTypeRouter } from "./global_post_type.router";
import { PendingBlogRouter } from "./pending_blog.router";
import { PendingPostRouter } from "./pending_post.router";
import { PostRouter } from "./post.router";

export const userRouter = trpcRouter.router({
  post: PostRouter,
  draft_post: DraftPostRouter,
  global_post_type: GlobalPostTypeRouter,
  global_post_detail: GlobalPostDetailRouter,
  pending_post: PendingPostRouter,
  blog: BlogRouter,
  draft_blog: DraftBlogRouter,
  pending_blog: PendingBlogRouter,
  global_blog_type: GlobalBlogTypeRouter,
});

export type TypeUserRouter = typeof userRouter;
