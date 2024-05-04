"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.trpcRouter = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
const prisma_1 = require("../utils/prisma");
const axios_1 = __importDefault(require("axios"));
exports.trpcRouter = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
});
exports.publicProcedure = exports.trpcRouter.procedure;
exports.protectedProcedure = exports.trpcRouter.procedure.use(async ({ ctx, next }) => {
    if (!(await ctx).userId)
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    const user = await prisma_1.dbContext.auth0Profile.findUnique({
        where: {
            UserId: (await ctx).userId,
        },
    });
    if (!user) {
        const userResponse = await (0, axios_1.default)({
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
        if (!auth0_user)
            throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
        await prisma_1.dbContext.auth0Profile.create({
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
});
