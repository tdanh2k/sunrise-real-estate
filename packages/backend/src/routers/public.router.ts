import z from "zod";
import { dbContext } from "../utils/prisma";
import { publicProcedure, trpcRouter } from "./router";
import { RequiredString } from "../utils/ZodUtils";
import axios from "axios";
import { TRPCError } from "@trpc/server";

export const PublicRouter = trpcRouter.router({
  topPost: publicProcedure
    .input(z.void())
    //.output(APIResponseSchema(z.array(PostSchema)))
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

      return {
        data,
      };
      // return await APIResponseSchema(z.array(PostSchema)).parseAsync({
      //   data,
      // });
    }),
  getPostById: publicProcedure
    .input(
      z.object({
        id: RequiredString,
      })
    )
    //.output(APIResponseSchema(PostSchema))
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

      return {
        data,
      };
      // return await APIResponseSchema(PostSchema).parseAsync({
      //   data,
      // });
    }),
  topBlogs: publicProcedure.input(z.void()).query(async () => {
    const data = await dbContext.blog.findMany({
      take: 5,
      include: {
        BlogImage: true,
        BlogStats: {
          orderBy: {
            ViewCount: "desc",
          },
        },
      },
    });

    return { data };
  }),
});
