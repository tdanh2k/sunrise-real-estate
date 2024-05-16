import * as trpcExpress from "@trpc/server/adapters/express";
import { AuthResult } from "express-oauth2-jwt-bearer";

export const createTRPCContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  res;
  return {
    userId: (req.auth as AuthResult)?.payload.sub,
    token: (req.auth as AuthResult)?.token,
    domain: (req.auth as AuthResult)?.payload?.iss,
  };
};

export type TRPCContext = ReturnType<typeof createTRPCContext>;
