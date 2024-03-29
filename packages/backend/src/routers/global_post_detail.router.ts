import z from "zod";
import { TType, t } from ".";
import { dbContext } from "../utils/prisma";
import { GlobalPostDetailSchema } from "../schemas/GlobalPostDetail.schema";
import { AddGlobalPostDetailSchema } from "../schemas/AddGlobalPostDetail.schema";
import { APIResponseSchema } from "../schemas/APIResponse.schema";
import { PaginationSchema } from "../schemas/Pagination.schema";

export const GlobalPostDetailRouter = (init: TType) =>
  init.router({
    all: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "GET",
          path: "/trpc/global_post_detail.all",
          tags: ["global_post_detail"],
        },
      })
      .input(z.void())
      .output(APIResponseSchema(z.array(GlobalPostDetailSchema)))
      .query(async (opt) => {
        const data = await dbContext.globalPostDetail.findMany();

        return await APIResponseSchema(
          z.array(GlobalPostDetailSchema)
        ).parseAsync({ data });
      }),
    byPage: t.procedure
      // .meta({
      //   /* 👉 */ openapi: { method: "GET", path: "/trpc/post.byPage", tags: ["post"]  },
      // })
      .input(PaginationSchema)
      .output(APIResponseSchema(z.array(GlobalPostDetailSchema)))
      .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 0;
        const page_size = input.paging.page_size ?? 10;

        const [data, row_count] = await dbContext.$transaction([
          dbContext.globalPostDetail.findMany({
            skip: page_index,
            take: page_size,
          }),
          dbContext.globalPostDetail.count(),
        ]);

        return await APIResponseSchema(
          z.array(GlobalPostDetailSchema)
        ).parseAsync({
          data,
          paging: {
            page_index,
            page_size,
            row_count,
          },
        });
      }),
    create: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "POST",
          path: "/trpc/global_post_detail.create",
          tags: ["global_post_detail"],
        },
      })
      .input(AddGlobalPostDetailSchema)
      .output(APIResponseSchema(GlobalPostDetailSchema.nullable()))
      .mutation(async ({ ctx, input }) => {
        //if (ctx.userId == null) return null;
        const data = await dbContext.globalPostDetail.create({
          data: input,
        });

        return await APIResponseSchema(
          GlobalPostDetailSchema.nullable()
        ).parseAsync({ data });
      }),
  });
