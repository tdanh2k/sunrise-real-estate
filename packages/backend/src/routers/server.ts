import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { dbContext } from "../utils/prisma";
import { AddPostSchema } from "../schemas/AddPost.schema";
import { Context } from "./context";
import { PostSchema } from "../schemas/Post.schema";
import { OpenApiMeta, generateOpenApiDocument } from "trpc-openapi";
import {
  OptionalBoolean,
  RequiredBoolean,
  RequiredString,
} from "../utils/ZodUtils";

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

// Access as /user.getUser
export const appRouter = t.router({
  // user: t.router({
  //   getAllUser: t.procedure
  //     .meta({
  //       /* 👉 */ openapi: { method: "GET", path: "/trpc/user.getAllUser" },
  //     })
  //     .query((opt) => {}),
  //   getUser: t.procedure
  //     .meta({
  //       /* 👉 */ openapi: { method: "GET", path: "/trpc/user.getUser" },
  //     })
  //     .input(z.string())
  //     .query((opts) => {
  //       return { id: opts.input, name: "Bilbo" };
  //     }),
  //   createUser: t.procedure
  //     .meta({
  //       /* 👉 */ openapi: { method: "POST", path: "/trpc/user.createUser" },
  //     })
  //     .input(z.object({ name: z.string().min(5) }))
  //     .mutation(async (opts) => {
  //       // use your ORM of choice
  //       return "Test";
  //     }),
  // }),
  post: t.router({
    all: t.procedure
      .meta({
        /* 👉 */ openapi: { method: "GET", path: "/trpc/post.all" },
      })
      .input(z.void())
      .output(z.array(PostSchema))
      .query(async (opt) => {
        const data = await dbContext.post.findMany({
          include: {
            PostCurrentDetail: true,
            PostImage: true,
            PostType: true,
            PostFeature: true,
          },
        });

        return z.array(PostSchema).parseAsync(data);
      }),
    byId: t.procedure
      .meta({
        /* 👉 */ openapi: { method: "GET", path: "/trpc/post.byId" },
      })
      .input(
        z.object({
          Id: RequiredString,
        })
      )
      .output(PostSchema.nullable())
      .query(async ({ input }) => {
        const data = await dbContext.post.findFirst({
          where: {
            Id: input.Id,
          },
          include: {
            PostCurrentDetail: true,
            PostImage: true,
            PostType: true,
            PostFeature: true,
          },
        });
        return PostSchema.nullable().parseAsync(data);
      }),
    add: t.procedure
      .meta({
        /* 👉 */ openapi: { method: "POST", path: "/trpc/post.add" },
      })
      .input(AddPostSchema)
      .output(OptionalBoolean.nullable())
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

          return Boolean(result);
        }
      ),
  }),
});

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "sunrise-real-estate OpenAPI",
  version: "1.0.0",
  baseUrl: "http://localhost:3000",
  description: "OpenAPI specification for sunrise-real-estate-backend",
});

// export type definition of API
export type AppRouter = typeof appRouter;
