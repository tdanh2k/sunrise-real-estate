"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const router_1 = require("../router");
const blog_router_1 = require("./blog.router");
const draft_blog_router_1 = require("./draft_blog.router");
const draft_post_router_1 = require("./draft_post.router");
const global_blog_type_router_1 = require("./global_blog_type.router");
const global_post_detail_router_1 = require("./global_post_detail.router");
const global_post_type_router_1 = require("./global_post_type.router");
const pending_blog_router_1 = require("./pending_blog.router");
const pending_post_router_1 = require("./pending_post.router");
const post_router_1 = require("./post.router");
exports.userRouter = router_1.trpcRouter.router({
    post: post_router_1.PostRouter,
    draft_post: draft_post_router_1.DraftPostRouter,
    global_post_type: global_post_type_router_1.GlobalPostTypeRouter,
    global_post_detail: global_post_detail_router_1.GlobalPostDetailRouter,
    pending_post: pending_post_router_1.PendingPostRouter,
    blog: blog_router_1.BlogRouter,
    draft_blog: draft_blog_router_1.DraftBlogRouter,
    pending_blog: pending_blog_router_1.PendingBlogRouter,
    global_blog_type: global_blog_type_router_1.GlobalBlogTypeRouter,
});
