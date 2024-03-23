import z from "zod";
import { TType, t } from ".";
import { PostSchema } from "../schemas/Post.schema";
import { dbContext } from "../utils/prisma";
import { RequiredString } from "../utils/ZodUtils";
import { AddPostSchema } from "../schemas/AddPost.schema";
import { PaginationSchema } from "../schemas/Pagination.schema";
import { APIResponseSchema } from "../schemas/APIResponse.schema";

export const PostRouter = (init: TType) =>
  init.router({
    all: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "GET",
          path: "/trpc/post.all",
          tags: ["post"],
        },
      })
      .input(z.void())
      .output(APIResponseSchema(z.array(PostSchema)))
      .query(async (opt) => {
        const data = await dbContext.post.findMany({
          include: {
            PostCurrentDetail: true,
            PostImage: true,
            PostType: true,
            PostFeature: true,
          },
        });

        return await APIResponseSchema(z.array(PostSchema)).parseAsync(data);
      }),
    top: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "GET",
          path: "/trpc/post.top",
          tags: ["post"],
        },
      })
      .input(z.void())
      .output(APIResponseSchema(z.array(PostSchema)))
      .query(async (opt) => {
        const data = await dbContext.post.findMany({
          take: 5,
          include: {
            PostCurrentDetail: true,
            PostImage: true,
            PostType: true,
            PostFeature: true,
          },
        });

        return await APIResponseSchema(z.array(PostSchema)).parseAsync(data);
      }),
    byPage: t.procedure
      // .meta({
      //   /* 👉 */ openapi: { method: "GET", path: "/trpc/post.byPage", tags: ["post"]  },
      // })
      .input(PaginationSchema)
      .output(APIResponseSchema(z.array(PostSchema)))
      .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;

        const [data, row_count] = await dbContext.$transaction([
          dbContext.post.findMany({
            skip: page_index,
            take: page_size,
            include: {
              PostCurrentDetail: true,
              PostImage: true,
              PostType: true,
              PostFeature: true,
            },
          }),
          dbContext.post.count(),
        ]);

        // const data = await dbContext.post.findMany({
        //   skip: page_index,
        //   take: page_size,
        //   include: {
        //     PostCurrentDetail: true,
        //     PostImage: true,
        //     PostType: true,
        //     PostFeature: true,
        //   },
        // });

        //const row_count = await dbContext.post.count();

        return await APIResponseSchema(z.array(PostSchema)).parseAsync({
          data,
          paging: {
            page_index,
            page_size,
            row_count,
          },
        });
      }),
    byId: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "GET",
          path: "/trpc/post.byId",
          tags: ["post"],
        },
      })
      .input(
        z.object({
          Id: RequiredString,
        })
      )
      .output(APIResponseSchema(PostSchema.nullable()))
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
        return await APIResponseSchema(PostSchema.nullable()).parseAsync({
          data,
        });
      }),
    publish: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "POST",
          path: "/trpc/post.publish",
          tags: ["post"],
        },
      })
      .input(AddPostSchema)
      .output(
        APIResponseSchema(
          PostSchema.omit({
            PostCurrentDetail: true,
            PostFeature: true,
            PostImage: true,
          }).nullable()
        )
      )
      .mutation(
        async ({
          ctx,
          input: { PostCurrentDetail, PostFeature, PostImage, ...rest },
        }) => {
          if (ctx.userId == null)
            return await APIResponseSchema(
              PostSchema.omit({
                PostCurrentDetail: true,
                PostFeature: true,
                PostImage: true,
              }).nullable()
            ).parseAsync({ data: null });

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

          return await APIResponseSchema(
            PostSchema.omit({
              PostCurrentDetail: true,
              PostFeature: true,
              PostImage: true,
            }).nullable()
          ).parseAsync({ data: result });
        }
      ),
    update: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "PUT",
          path: "/trpc/post.update",
          tags: ["post"],
        },
      })
      .input(PostSchema)
      .output(
        APIResponseSchema(
          PostSchema.omit({
            PostCurrentDetail: true,
            PostFeature: true,
            PostImage: true,
          }).nullable()
        )
      )
      .mutation(
        async ({
          ctx,
          input: { Id, PostCurrentDetail, PostFeature, PostImage, ...rest },
        }) => {
          //if (ctx.userId == null) return null;

          const result = await dbContext.post.update({
            where: {
              Id,
            },
            data: {
              ...rest,
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

          return await APIResponseSchema(
            PostSchema.omit({
              PostCurrentDetail: true,
              PostFeature: true,
              PostImage: true,
            }).nullable()
          ).parseAsync(result);
        }
      ),
  });
