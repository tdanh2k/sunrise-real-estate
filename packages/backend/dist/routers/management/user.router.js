import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { UpdateAuth0UserSchema, } from "../../schemas/UpdateAuth0User.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { z } from "zod";
import { auth0Management } from "../../app.js";
export const AdminUserRouter = trpcRouter.router({
    byPage: protectedProcedure
        .input(PaginationSchema)
        .query(async ({ input: { paging } }) => {
        const data = await dbContext.auth0Profile.findMany({
            skip: (paging.page_size ?? 10) * (paging.page_index ?? 0),
            take: paging.page_size ?? 10,
        });
        return {
            data,
        };
    }),
    byUserId: protectedProcedure
        .input(z.object({
        Id: RequiredString,
    }))
        .query(async ({ input }) => {
        const data = await dbContext.auth0Profile.findFirst({
            where: {
                user_id: input.Id ?? "00000000-0000-0000-0000-000000000000",
            },
        });
        return {
            data,
        };
    }),
    update: protectedProcedure
        .input(UpdateAuth0UserSchema)
        .mutation(async ({ ctx, input }) => {
        const userUpdateResponse = await auth0Management.users.update({
            id: (await ctx).userId ?? "",
        }, input);
        const auth0_user = userUpdateResponse?.data;
        await dbContext.auth0Profile.upsert({
            create: {
                ...auth0_user,
                last_login: new Date(auth0_user?.last_login),
            },
            update: auth0_user,
            where: {
                user_id: auth0_user?.user_id ?? (await ctx).userId,
            },
        });
        return {
            data: auth0_user,
        };
    }),
});
