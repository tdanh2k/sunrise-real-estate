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

    const user = await dbContext.auth0Profile.findUnique({
      where: {
        UserId: (await ctx).userId,
      },
    });

    if (!user) {
      const userResponse = await axios<TypeAuth0User>({
        url: `${(await ctx).domain}api/v2/users/${encodeURIComponent((await ctx).userId ?? "")}`,
        method: "GET",
        params: {
          search_engine: "v3",
        },
        headers: {
          Authorization: `Bearer ${(await ctx).management_token}`,
        },
      });

      const auth0_user = userResponse?.data;

      if (!auth0_user) throw new TRPCError({ code: "UNAUTHORIZED" });

      await dbContext.auth0Profile.create({
        data: {
          UserId: auth0_user?.user_id,
          Username: auth0_user?.username,
          Email: auth0_user?.email,
          EmailVerified: auth0_user?.email_verified,
          PhoneNumber: auth0_user?.phone_number,
          PhoneVerified: auth0_user?.phone_verified,
          Name: auth0_user?.name,
          Nickname: auth0_user?.nickname,
          GivenName: auth0_user?.given_name,
          FamilyName: auth0_user?.family_name,
          Picture: auth0_user?.picture,
          LastIp: auth0_user?.last_ip,
          LastLogin: auth0_user?.last_login,
          LoginsCount: auth0_user?.logins_count,
          Blocked: auth0_user?.blocked,
        },
      });

      // await dbContext.auth0Profile.upsert({
      //   create: {
      //     UserId: auth0_user?.user_id,
      //     Username: auth0_user?.username,
      //     Email: auth0_user?.email,
      //     EmailVerified: auth0_user?.email_verified,
      //     PhoneNumber: auth0_user?.phone_number,
      //     PhoneVerified: auth0_user?.phone_verified,
      //     Name: auth0_user?.name,
      //     Nickname: auth0_user?.nickname,
      //     GivenName: auth0_user?.given_name,
      //     FamilyName: auth0_user?.family_name,
      //     Picture: auth0_user?.picture,
      //     LastIp: auth0_user?.last_ip,
      //     LastLogin: auth0_user?.last_login,
      //     LoginsCount: auth0_user?.logins_count,
      //     Blocked: auth0_user?.blocked,
      //   },
      //   update: {
      //     Username: auth0_user?.username,
      //     Email: auth0_user?.email,
      //     EmailVerified: auth0_user?.email_verified,
      //     PhoneNumber: auth0_user?.phone_number,
      //     PhoneVerified: auth0_user?.phone_verified,
      //     Name: auth0_user?.name,
      //     Nickname: auth0_user?.nickname,
      //     GivenName: auth0_user?.given_name,
      //     FamilyName: auth0_user?.family_name,
      //     Picture: auth0_user?.picture,
      //     LastIp: auth0_user?.last_ip,
      //     LastLogin: auth0_user?.last_login,
      //     LoginsCount: auth0_user?.logins_count,
      //     Blocked: auth0_user?.blocked,
      //   },
      //   where: {
      //     UserId: (await ctx).userId,
      //   },
      // });
    }

    return next({
      ctx,
    });
  }
);

export type TypeTRPCRouter = typeof trpcRouter;
