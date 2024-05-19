import { TRPCError, initTRPC } from "@trpc/server";
import { TRPCContext } from "./context.js";
import SuperJSON from "superjson";
import { dbContext } from "../utils/prisma.js";
import { auth0Management } from "../app.js";

export const trpcRouter = initTRPC.context<TRPCContext>().create({
  transformer: SuperJSON,
});

export const publicProcedure = trpcRouter.procedure;

export const protectedProcedure = trpcRouter.procedure.use(
  async ({ ctx, next }) => {
    if (!(await ctx).userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const user = await dbContext.auth0Profile.findUnique({
      where: {
        user_id: (await ctx).userId,
      },
    });

    if (!user) {
      const userResponse = await auth0Management.users.get({
        id: (await ctx).userId ?? "",
      });

      const auth0_user = userResponse?.data;

      if (!auth0_user) throw new TRPCError({ code: "UNAUTHORIZED" });

      await dbContext.auth0Profile.create({
        data: {
          ...auth0_user,
          last_login: new Date(auth0_user?.last_login as string),
        },
      });
    }

    return next({
      ctx,
    });
  }
);

export type TypeTRPCRouter = typeof trpcRouter;
