"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.trpcRouter = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
exports.trpcRouter = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
});
exports.publicProcedure = exports.trpcRouter.procedure;
exports.protectedProcedure = exports.trpcRouter.procedure.use(async ({ ctx, next }) => {
    if (!(await ctx).userId)
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    return next({
        ctx,
    });
});
