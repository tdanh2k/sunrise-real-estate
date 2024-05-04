import { trpcRouter } from "../router.js";
import { BlogRouter } from "./blog.router.js";
import { DraftBlogRouter } from "./draft_blog.router.js";
import { DraftPostRouter } from "./draft_post.router.js";
import { GlobalBlogTypeRouter } from "./global_blog_type.router.js";
import { GlobalPostDetailRouter } from "./global_post_detail.router.js";
import { GlobalPostTypeRouter } from "./global_post_type.router.js";
import { PendingBlogRouter } from "./pending_blog.router.js";
import { PendingPostRouter } from "./pending_post.router.js";
import { PostRouter } from "./post.router.js";

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
