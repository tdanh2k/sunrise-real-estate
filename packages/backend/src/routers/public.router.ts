import z from "zod";
import { dbContext } from "../utils/prisma";
import { APIResponseSchema } from "../schemas/APIResponse.schema";
import { PostSchema } from "../schemas/Post.schema";
import { publicProcedure, trpcRouter } from "./router";

export const PublicRouter = trpcRouter.router({
  topPost: publicProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/public/post.top",
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

      return await APIResponseSchema(z.array(PostSchema)).parseAsync({
        data,
      });
    }),
});
