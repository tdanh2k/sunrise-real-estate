import * as trpcExpress from "@trpc/server/adapters/express";

export const createTRPCContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return ({
    userId: req.auth?.payload.sub,
    token: req.auth?.token,
    domain: req.auth?.payload?.iss
  })
}; // no context

export type TRPCContext = ReturnType<typeof createTRPCContext>;
