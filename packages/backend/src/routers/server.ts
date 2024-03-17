import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { dbContext } from "../utils/prisma";
import { AddPostSchema } from "../schemas/AddPost.schema";
import { Context } from "./context";
import { PostSchema } from "../schemas/Post.schema";

export const t = initTRPC.context<Context>().create();

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
          PostCurrentDetail: true,
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
          PostCurrentDetail: true,
          PostImage: true,
          PostType: true,
        },
      });

      return data;
    }),
    add: t.procedure
      .input(AddPostSchema)
      .mutation(
        async ({
          ctx,
          input: { PostCurrentDetail, PostFeature, PostImage, ...rest },
        }) => {
          if (ctx.userId == null) return null;

          const result = await dbContext.post.create({
            data: {
              ...rest,
              UserId: ctx.userId,
              PostCurrentDetail: {
                connectOrCreate: PostCurrentDetail?.map((item) => ({
                  where: {
                    Id: item.Id,
                  },
                  create: item,
                })),
              },
              PostFeature: {
                connectOrCreate: PostFeature?.map((item) => ({
                  where: {
                    Id: item.Id,
                  },
                  create: item,
                })),
              },
              PostImage: {
                connectOrCreate: PostImage?.map((item) => ({
                  where: {
                    Id: item.Id,
                  },
                  create: item,
                })),
              },
            },
          });

          return result;
        }
      ),
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
