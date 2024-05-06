import axios from "axios";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { APIResponseSchema } from "../../schemas/APIResponse.schema.js";
import { z } from "zod";
import { TypeAuth0User } from "../../schemas/Auth0User.schema.js";

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
