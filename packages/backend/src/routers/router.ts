import { TRPCError, initTRPC } from "@trpc/server";
import { TRPCContext } from "./context.js";
import SuperJSON from "superjson";
import { dbContext } from "../utils/prisma.js";
import axios from "axios";
import { TypeAuth0User } from "../schemas/Auth0User.schema.js";

export const trpcRouter = initTRPC.context<TRPCContext>().create({
  transformer: SuperJSON,
});

export const publicProcedure = trpcRouter.procedure;

export const protectedProcedure = trpcRouter.procedure.use(
  async ({ ctx, next }) => {
    if (!(await ctx).userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    // const user = await dbContext.auth0Profile.findUnique({
    //   where: {
    //     user_id: (await ctx).userId,
    //   },
    // });
    
    // if (!user) {
    //   const userResponse = await axios<TypeAuth0User>({
    //     url: `${(await ctx).domain}api/v2/users/${encodeURIComponent((await ctx).userId ?? "")}`,
    //     method: "GET",
    //     params: {
    //       search_engine: "v3",
    //     },
    //     headers: {
    //       Authorization: `Bearer ${(await ctx).management_token}`,
    //     },
    //   });

    //   const auth0_user = userResponse?.data;

    //   if (!auth0_user) throw new TRPCError({ code: "UNAUTHORIZED" });

    //   await dbContext.auth0Profile.create({
    //     data: auth0_user,
    //   });
    // }

    return next({
      ctx,
    });
  }
);

export type TypeTRPCRouter = typeof trpcRouter;
