import z from "zod";
import { t } from ".";
import { PostSchema } from "../schemas/Post.schema";
import { dbContext } from "../utils/prisma";
import { RequiredString } from "../utils/ZodUtils";
import { AddPostSchema } from "../schemas/AddPost.schema";

export const PostRouter = t.router({
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

      return await z.array(PostSchema).parseAsync(data);
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
      return await PostSchema.nullable().parseAsync(data);
    }),
  add: t.procedure
    .meta({
      /* 👉 */ openapi: { method: "POST", path: "/trpc/post.add" },
    })
    .input(AddPostSchema)
    .output(
      PostSchema.omit({
        PostCurrentDetail: true,
        PostFeature: true,
        PostImage: true,
      }).nullable()
    )
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

        return await PostSchema.omit({
          PostCurrentDetail: true,
          PostFeature: true,
          PostImage: true,
        }).parseAsync(result);
      }
    ),
});
