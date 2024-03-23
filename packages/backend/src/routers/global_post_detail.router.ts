import z from "zod";
import { TType, t } from ".";
import { dbContext } from "../utils/prisma";
import { GlobalPostDetailSchema } from "../schemas/GlobalPostDetail.schema";
import { AddGlobalPostDetailSchema } from "../schemas/AddGlobalPostDetail.schema";

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
      .output(z.array(GlobalPostDetailSchema))
      .query(async (opt) => {
        const data = await dbContext.globalPostDetail.findMany();

        return await z.array(GlobalPostDetailSchema).parseAsync(data);
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
      .output(GlobalPostDetailSchema.nullable())
      .mutation(async ({ ctx, input }) => {
        //if (ctx.userId == null) return null;
        const result = await dbContext.globalPostDetail.create({
          data: input,
        });

        return await GlobalPostDetailSchema.nullable().parseAsync(result);
      }),
  });
