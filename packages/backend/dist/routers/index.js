"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicAppRouter = exports.appRouter = void 0;
const public_router_1 = require("./public.router");
const router_1 = require("./router");
const management_1 = require("./management");
const user_1 = require("./user");
// Access as /user.getUser
exports.appRouter = router_1.trpcRouter.router({
    management: management_1.managementRouter,
    user: user_1.userRouter,
});
exports.publicAppRouter = public_router_1.PublicRouter;
