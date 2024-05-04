import { managementRouter } from "./management/index.js";
import { PublicRouter } from "./public.router.js";
import { trpcRouter } from "./router.js";
import { userRouter } from "./user/index.js";

// Access as /user.getUser
export const appRouter = trpcRouter.router({
  management: managementRouter,
  user: userRouter,
});

export const publicAppRouter = PublicRouter;

// export const openApiDocument = generateOpenApiDocument(appRouter, {
//   title: "sunrise-real-estate OpenAPI",
//   version: "1.0.0",
//   baseUrl: "http://localhost:3000",
//   description: "OpenAPI specification for sunrise-real-estate-backend",
// });

// export type definition of API
export type AppRouter = typeof appRouter;

export type PublicAppRouter = typeof publicAppRouter;
