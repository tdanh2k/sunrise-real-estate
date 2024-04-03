import * as trpcExpress from "@trpc/server/adapters/express";

export const createTRPCContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return ({
    userId: req.auth?.payload.sub,
    auth: req.auth
  })
}; // no context

export type TRPCContext = ReturnType<typeof createTRPCContext>;
