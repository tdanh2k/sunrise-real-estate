import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { UpdateAuth0UserSchema } from "../../schemas/UpdateAuth0User.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { z } from "zod";
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
        // const userUpdateResponse = await auth0Management.users.update(
        //   {
        //     id: (await ctx).userId ?? "",
        //   },
        //   {
        //     //...input,
        //     connection: "sunrise-real-estate-db",
        //     client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
        //     email: input?.email,
        //     password: input?.password ? input.password : undefined,
        //     //phone_number: input?.phone_number ? input.phone_number : undefined,
        //   }
        // );
        // const auth0_user = userUpdateResponse?.data;
        // await dbContext.auth0Profile.upsert({
        //   create: {
        //     ...auth0_user,
        //     last_login: new Date(auth0_user?.last_login as string),
        //   },
        //   update: auth0_user,
        //   where: {
        //     user_id: auth0_user?.user_id ?? (await ctx).userId,
        //   },
        // });
        const data = await dbContext.auth0Profile.update({
            data: input,
            where: {
                user_id: (await ctx).userId,
            },
        });
        return {
            data: data,
        };
    }),
});
