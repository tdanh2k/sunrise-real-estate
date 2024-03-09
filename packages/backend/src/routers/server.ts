import { initTRPC } from "@trpc/server";
import { z } from "zod";

export const t = initTRPC.create();

// Access as /user.getUser
export const appRouter = t.router({
  user: t.router({
    getUser: t.procedure.input(z.string()).query((opts) => {
      return { id: opts.input, name: "Bilbo" };
    }),
    createUser: t.procedure
      .input(z.object({ name: z.string().min(5) }))
      .mutation(async (opts) => {
        // use your ORM of choice
        return "Test";
      }),
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
