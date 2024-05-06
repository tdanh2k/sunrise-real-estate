"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequiredPermissions = exports.validateAccessToken = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
exports.validateAccessToken = (0, express_oauth2_jwt_bearer_1.auth)({
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    audience: process.env.AUTH0_AUDIENCE,
});
const checkRequiredPermissions = (requiredPermissions) => (req, res, next) => {
    const permissionCheck = (0, express_oauth2_jwt_bearer_1.claimCheck)((payload) => {
        const permissions = payload.permissions;
        const hasPermissions = requiredPermissions.every((requiredPermission) => permissions.includes(requiredPermission));
        if (!hasPermissions) {
            throw new express_oauth2_jwt_bearer_1.InsufficientScopeError();
        }
        return hasPermissions;
    });
    permissionCheck(req, res, next);
};
exports.checkRequiredPermissions = checkRequiredPermissions;
