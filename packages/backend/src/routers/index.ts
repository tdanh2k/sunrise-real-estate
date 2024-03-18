import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import { OpenApiMeta, generateOpenApiDocument } from "trpc-openapi";
import { PostRouter } from "./post.router";

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

// Access as /user.getUser
export const appRouter = t.router({
  post: PostRouter,
});

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "sunrise-real-estate OpenAPI",
  version: "1.0.0",
  baseUrl: "http://localhost:3000",
  description: "OpenAPI specification for sunrise-real-estate-backend",
});

// export type definition of API
export type AppRouter = typeof appRouter;
