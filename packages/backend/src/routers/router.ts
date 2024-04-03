import { TRPCError, initTRPC } from "@trpc/server";
import { TRPCContext } from "./context";
import { OpenApiMeta } from "trpc-openapi";
import SuperJSON from "superjson";

export const trpcRouter = initTRPC
  .context<TRPCContext>()
  .meta<OpenApiMeta>()
  .create({
    transformer: SuperJSON,
  });

export const publicProcedure = trpcRouter.procedure;

export const protectedProcedure = trpcRouter.procedure.use(({ ctx, next }) => {
  if (!ctx.auth || !ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx,
  });
});

export type TypeTRPCRouter = typeof trpcRouter;
