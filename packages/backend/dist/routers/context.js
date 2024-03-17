"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTRPCContext = void 0;
const createTRPCContext = ({ req, res, }) => ({
    userId: req.auth?.payload.sub,
}); // no context
exports.createTRPCContext = createTRPCContext;
