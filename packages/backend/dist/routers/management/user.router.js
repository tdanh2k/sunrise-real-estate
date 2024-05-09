import axios from "axios";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { UpdateAuth0UserSchema } from "../../schemas/UpdateAuth0User.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { z } from "zod";
export const AdminUserRouter = trpcRouter.router({
    byPage: protectedProcedure
        .input(PaginationSchema)
        //.output(APIResponseSchema(z.custom<TypeAuth0User[]>()))
        .query(async ({ input: { paging } }) => {
        // const response = await axios<TypeAuth0User[]>({
        //   url: `${(await ctx).domain}api/v2/users`,
        //   method: "GET",
        //   params: {
        //     search_engine: "v3",
        //     page: input.paging.page_index,
        //   },
        //   headers: {
        //     Authorization: `Bearer ${(await ctx).management_token}`,
        //   },
        // });
        const data = await dbContext.auth0Profile.findMany({
            skip: (paging.page_size ?? 10) * (paging.page_index ?? 0),
            take: paging.page_size ?? 10,
        });
        return {
            data,
        };
        // return await APIResponseSchema(z.custom<TypeAuth0User[]>()).parseAsync({
        //   data: response?.data,
        // });
    }),
    byUserId: protectedProcedure
        .input(z.object({
        Id: RequiredString,
    }))
        //.output(APIResponseSchema(Auth0UserSchema.nullable()))
        .query(async ({ input }) => {
        const data = await dbContext.auth0Profile.findFirst({
            where: {
                user_id: input.Id ?? "00000000-0000-0000-0000-000000000000",
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(Auth0UserSchema.nullable()).parseAsync({
        //   data,
        // });
    }),
    update: protectedProcedure
        .input(UpdateAuth0UserSchema)
        .mutation(async ({ ctx }) => {
        const response = await axios({
            url: `${(await ctx).domain}api/v2/users/${(await ctx).userId}`,
            method: "PATCH",
            data: {},
            headers: {
                Authorization: `Bearer ${(await ctx).management_token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const auth0_user = response?.data;
        await dbContext.auth0Profile.upsert({
            create: auth0_user,
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
