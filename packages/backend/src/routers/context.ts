import * as trpcExpress from "@trpc/server/adapters/express";
import axios from "axios";
import { AuthResult } from "express-oauth2-jwt-bearer";

export const createTRPCContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  res;
  //console.log(req.auth)
  const tokenResponse = await axios<{
    access_token: string;
    token_type: string;
  }>({
    method: "POST",
    url: `${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { "content-type": "application/json" },
    data: {
      client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: "client_credentials",
    },
  });
  
  return {
    userId: (req.auth as AuthResult)?.payload.sub,
    token: (req.auth as AuthResult)?.token,
    domain: (req.auth as AuthResult)?.payload?.iss,
    management_token: tokenResponse?.data?.access_token,
  };
}; // no context

export type TRPCContext = ReturnType<typeof createTRPCContext>;
