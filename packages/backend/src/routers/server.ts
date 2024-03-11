import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { dbContext } from "../utils/prisma";

export const t = initTRPC.create();

// Access as /user.getUser
export const appRouter = t.router({
  user: t.router({
    getAllUser: t.procedure.query((opt) => {}),
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
  post: t.router({
    all: t.procedure.query(async (opt) => {
      const data = await dbContext.post.findMany({
        include: {
          PostCurrentParam: true,
          PostImage: true,
          PostType: true,
        },
      });

      return data;
    }),
    byId: t.procedure.input(z.string()).query(async ({ input }) => {
      const data = await dbContext.post.findFirst({
        where: {
          Id: input,
        },
        include: {
          PostCurrentParam: true,
          PostImage: true,
          PostType: true,
        },
      });

      return data;
    }),
    // add: t.procedure.input().mutation(opt => {

    // })
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
