import z from "zod";
import { TType, t } from ".";
import { dbContext } from "../utils/prisma";
import { GlobalPostDetailSchema } from "../schemas/GlobalPostDetail.schema";
import { AddGlobalPostDetailSchema } from "../schemas/AddGlobalPostDetail.schema";
import { APIResponseSchema } from "../schemas/APIResponse.schema";

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
