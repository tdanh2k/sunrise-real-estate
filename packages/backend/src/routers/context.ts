import * as trpcExpress from "@trpc/server/adapters/express";
import axios from "axios";

export const createTRPCContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  //console.log(req.auth)
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

  return {
    userId: req.auth?.payload.sub,
    token: req.auth?.token,
    domain: req.auth?.payload?.iss,
    management_token: tokenResponse?.data?.access_token
  };
}; // no context

export type TRPCContext = ReturnType<typeof createTRPCContext>;
