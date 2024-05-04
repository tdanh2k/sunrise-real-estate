"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTRPCContext = void 0;
const axios_1 = __importDefault(require("axios"));
const createTRPCContext = async ({ req, res, }) => {
    res;
    //console.log(req.auth)
    const tokenResponse = await (0, axios_1.default)({
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
        userId: req.auth?.payload.sub,
        token: req.auth?.token,
        domain: req.auth?.payload?.iss,
        management_token: tokenResponse?.data?.access_token,
    };
}; // no context
exports.createTRPCContext = createTRPCContext;
