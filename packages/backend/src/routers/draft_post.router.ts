import z from "zod";
import { TType, t } from ".";
import { DraftPostSchema } from "../schemas/DraftPost.schema";
import { dbContext } from "../utils/prisma";
import { OptionalBoolean, RequiredString } from "../utils/ZodUtils";
import { AddDraftPostSchema } from "../schemas/AddDraftPost.schema";
import { APIResponseSchema } from "../schemas/APIResponse.schema";
import { TRPCError } from "@trpc/server";

export const DraftPostRouter = (init: TType) =>
  init.router({
    all: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "GET",
          path: "/trpc/draft_post.all",
          tags: ["draft_post"],
        },
      })
      .input(z.void())
      .output(APIResponseSchema(z.array(DraftPostSchema)))
      .query(async (opt) => {
        const data = await dbContext.post.findMany({
          include: {
            PostCurrentDetail: true,
            PostImage: true,
            PostType: true,
            PostFeature: true,
          },
        });

        return await APIResponseSchema(z.array(DraftPostSchema)).parseAsync({
          data,
        });
      }),
    byId: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "GET",
          path: "/trpc/draft_post.byId",
          tags: ["draft_post"],
        },
      })
      .input(
        z.object({
          Id: RequiredString,
        })
      )
      .output(APIResponseSchema(DraftPostSchema.nullable()))
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
        return await APIResponseSchema(DraftPostSchema.nullable()).parseAsync({
          data,
        });
      }),
    create: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "POST",
          path: "/trpc/draft_post.create",
          tags: ["draft_post"],
        },
      })
      .input(AddDraftPostSchema)
      .output(
        APIResponseSchema(
          DraftPostSchema.omit({
            DraftCurrentDetail: true,
            DraftFeature: true,
            DraftPostImage: true,
          }).nullable()
        )
      )
      .mutation(
        async ({
          ctx,
          input: { DraftCurrentDetail, DraftFeature, DraftPostImage, ...rest },
        }) => {
          if (ctx.userId == null)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: ``,
            });

          const data = await dbContext.draftPost.create({
            data: {
              ...rest,
              UserId: ctx.userId,
              DraftCurrentDetail: {
                createMany: {
                  data: DraftCurrentDetail,
                },
                // connectOrCreate: DraftCurrentDetail?.map((item) => ({
                //   where: {
                //     Id: item.Id,
                //   },
                //   create: item,
                // })),
              },
              DraftFeature: {
                createMany: {
                  data: DraftFeature,
                },
                // connectOrCreate: DraftFeature?.map((item) => ({
                //   where: {
                //     Id: item.Id,
                //   },
                //   create: item,
                // })),
              },
              DraftPostImage: {
                createMany: {
                  data: DraftPostImage,
                },
                // connectOrCreate: DraftPostImage?.map((item) => ({
                //   where: {
                //     Id: item.Id,
                //   },
                //   create: item,
                // })),
              },
            },
          });

          return await APIResponseSchema(
            DraftPostSchema.omit({
              DraftCurrentDetail: true,
              DraftFeature: true,
              DraftPostImage: true,
            }).nullable()
          ).parseAsync({ data });
        }
      ),
    update: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "PUT",
          path: "/trpc/draft_post.update",
          tags: ["draft_post"],
        },
      })
      .input(DraftPostSchema)
      .output(
        APIResponseSchema(
          DraftPostSchema.omit({
            DraftCurrentDetail: true,
            DraftFeature: true,
            DraftPostImage: true,
          }).nullable()
        )
      )
      .mutation(
        async ({
          ctx,
          input: {
            Id,
            DraftCurrentDetail,
            DraftFeature,
            DraftPostImage,
            ...rest
          },
        }) => {
          //if (ctx.userId == null) return null;

          const result = await dbContext.draftPost.update({
            where: {
              Id,
            },
            data: {
              ...rest,
              DraftCurrentDetail: {
                connectOrCreate: DraftCurrentDetail?.map((item) => ({
                  where: {
                    Id: item.Id,
                  },
                  create: item,
                })),
              },
              DraftFeature: {
                connectOrCreate: DraftFeature?.map((item) => ({
                  where: {
                    Id: item.Id,
                  },
                  create: item,
                })),
              },
              DraftPostImage: {
                connectOrCreate: DraftPostImage?.map((item) => ({
                  where: {
                    Id: item.Id,
                  },
                  create: item,
                })),
              },
            },
          });

          return await APIResponseSchema(
            DraftPostSchema.omit({
              DraftCurrentDetail: true,
              DraftFeature: true,
              DraftPostImage: true,
            })
          ).parseAsync(result);
        }
      ),

    delete: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "DELETE",
          path: "/trpc/draft_post.delete",
          tags: ["draft_post"],
        },
      })
      .input(z.object({ Id: RequiredString }))
      .output(APIResponseSchema(OptionalBoolean.nullable()))
      .mutation(async ({ ctx, input: { Id } }) => {
        //if (ctx.userId == null) return null;

        const result = await dbContext.draftPost.delete({
          where: {
            Id,
          },
        });

        return await APIResponseSchema(OptionalBoolean.nullable()).parseAsync({
          data: Boolean(result),
        });
      }),
  });
