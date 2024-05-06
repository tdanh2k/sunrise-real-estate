import { InsufficientScopeError, auth, claimCheck, } from "express-oauth2-jwt-bearer";
export const validateAccessToken = auth({
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    audience: process.env.AUTH0_AUDIENCE,
});
export const checkRequiredPermissions = (requiredPermissions) => (req, res, next) => {
    const permissionCheck = claimCheck((payload) => {
        const permissions = payload.permissions;
        const hasPermissions = requiredPermissions.every((requiredPermission) => permissions.includes(requiredPermission));
        if (!hasPermissions) {
            throw new InsufficientScopeError();
        }
        return hasPermissions;
    });
    permissionCheck(req, res, next);
};
