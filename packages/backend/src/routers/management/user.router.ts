import axios from "axios";
import { PaginationSchema } from "../../schemas/Pagination.schema";
import { protectedProcedure, trpcRouter } from "../router";
import { APIResponseSchema } from "../../schemas/APIResponse.schema";
import { z } from "zod";
import { TypeAuth0User } from "../../schemas/Auth0User.schema";

export const AdminUserRouter = trpcRouter.router({
  byPage: protectedProcedure
    .input(PaginationSchema)
    .output(APIResponseSchema(z.custom<TypeAuth0User[]>()))
    .query(async ({ ctx, input }) => {

      const response = await axios<TypeAuth0User[]>({
        url: `${(await ctx).domain}api/v2/users`,
        method: "GET",
        params: {
          search_engine: "v3",
          page: input.paging.page_index,
        },
        headers: {
          Authorization: `Bearer ${(await ctx).management_token}`,
        },
      });

      return await APIResponseSchema(z.custom<TypeAuth0User[]>()).parseAsync({
        data: response?.data,
      });
    }),
});
