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
      const tokenResponse = await axios<{
        access_token: string;
        token_type: string;
      }>({
        method: "POST",
        url: "https://dev-ofnrpe1wby52d4ok.us.auth0.com/oauth/token",
        headers: { "content-type": "application/json" },
        data: {
          client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
          client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
          audience: process.env.AUTH0_AUDIENCE,
          grant_type: "client_credentials",
        },
      });

      const response = await axios<TypeAuth0User[]>({
        url: `${ctx.domain}api/v2/users`,
        method: "GET",
        params: {
          search_engine: "v3",
          page: input.paging.page_index,
        },
        headers: {
          Authorization: `${tokenResponse?.data?.token_type} ${tokenResponse?.data?.access_token}`,
        },
      });

      return await APIResponseSchema(z.custom<TypeAuth0User[]>()).parseAsync({
        data: response?.data,
      });
    }),
});
