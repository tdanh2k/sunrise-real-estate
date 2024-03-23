import { initTRPC } from "@trpc/server";
import { TRPCContext } from "./context";
import { OpenApiMeta, generateOpenApiDocument } from "trpc-openapi";
import { PostRouter } from "./post.router";
import { DraftPostRouter } from "./draft_post.router";
import { GlobalPostTypeRouter } from "./global_post_type.router";
import superjson from "superjson";
import { GlobalPostDetailRouter } from "./global_post_detail.router";

export const t = initTRPC.context<TRPCContext>().meta<OpenApiMeta>().create({
  transformer: superjson,
});

export type TType = typeof t;

// Access as /user.getUser
export const appRouter = t.router({
  post: PostRouter(t),
  draft_post: DraftPostRouter(t),
  global_post_type: GlobalPostTypeRouter(t),
  global_post_detail: GlobalPostDetailRouter(t),
});

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "sunrise-real-estate OpenAPI",
  version: "1.0.0",
  baseUrl: "http://localhost:3000",
  description: "OpenAPI specification for sunrise-real-estate-backend",
});

// export type definition of API
export type AppRouter = typeof appRouter;
