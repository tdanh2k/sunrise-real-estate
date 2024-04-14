import z from "zod";
import { dbContext } from "../utils/prisma";
import { APIResponseSchema } from "../schemas/APIResponse.schema";
import { PostSchema } from "../schemas/Post.schema";
import { publicProcedure, trpcRouter } from "./router";
import { RequiredString } from "../utils/ZodUtils";

export const PublicRouter = trpcRouter.router({
  topPost: publicProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/public/topPost",
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
          PostStats: {
            orderBy: {
              ViewCount: "desc",
            },
          },
        },
      });

      return await APIResponseSchema(z.array(PostSchema)).parseAsync({
        data,
      });
    }),
  getPostById: publicProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/public/getPostById",
        tags: ["post"],
      },
    })
    .input(
      z.object({
        id: RequiredString,
      })
    )
    .output(APIResponseSchema(PostSchema))
    .query(async ({ input }) => {
      const data = await dbContext.post.findFirst({
        where: {
          Id: input.id,
        },
        include: {
          PostCurrentDetail: true,
          PostImage: true,
          PostType: true,
          PostFeature: true,
          PostStats: true,
        },
      });

      return await APIResponseSchema(PostSchema).parseAsync({
        data,
      });
    }),
});
