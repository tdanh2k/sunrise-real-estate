import { TRPCError, initTRPC } from "@trpc/server";
import { TRPCContext } from "./context";
import SuperJSON from "superjson";

export const trpcRouter = initTRPC.context<TRPCContext>().create({
  transformer: SuperJSON,
});

export const publicProcedure = trpcRouter.procedure;

export const protectedProcedure = trpcRouter.procedure.use(
  async ({ ctx, next }) => {
    if (!(await ctx).userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    return next({
      ctx,
    });
  }
);

export type TypeTRPCRouter = typeof trpcRouter;
