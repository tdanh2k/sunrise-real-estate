import * as trpcExpress from "@trpc/server/adapters/express";

export const createTRPCContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  userId: req.auth?.payload.sub,
}); // no context

export type TRPCContext = ReturnType<typeof createTRPCContext>;
