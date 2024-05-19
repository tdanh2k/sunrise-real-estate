export const createTRPCContext = async ({ req, res, }) => {
    res;
    return {
        userId: req.auth?.payload.sub,
        token: req.auth?.token,
        domain: req.auth?.payload?.iss,
    };
};
