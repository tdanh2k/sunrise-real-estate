import { managementRouter } from "./management/index.js";
import { PublicRouter } from "./public.router.js";
import { trpcRouter } from "./router.js";
import { userRouter } from "./user/index.js";
// Access as /user.getUser
export const appRouter = trpcRouter.router({
    management: managementRouter,
    user: userRouter,
});
export const publicAppRouter = PublicRouter;
