import z from "zod";
import { TType, t } from ".";
import { dbContext } from "../utils/prisma";
import { GlobalPostTypeSchema } from "../schemas/GlobalPostType.schema";
import { AddGlobalPostTypeSchema } from "../schemas/AddGlobalPostType.schema";
import { OptionalDate } from "../utils/ZodUtils";

export const GlobalPostTypeRouter = (init: TType) =>
  init.router({
    all: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "GET",
          path: "/trpc/global_post_type.all",
          tags: ["global_post_type"],
        },
      })
      .input(z.void())
      .output(z.array(GlobalPostTypeSchema))
      .query(async (opt) => {
        const data = await dbContext.globalBlogType.findMany();

        return await z.array(GlobalPostTypeSchema).parseAsync(data);
      }),
    create: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "POST",
          path: "/trpc/global_post_type.create",
          tags: ["global_post_type"],
        },
      })
      .input(AddGlobalPostTypeSchema)
      .output(GlobalPostTypeSchema.nullable())
      .mutation(async ({ ctx, input }) => {
        //if (ctx.userId == null) return null;
        const result = await dbContext.globalBlogType.create({
          data: input,
        });

        return await GlobalPostTypeSchema.nullable().parseAsync(result);
      }),
  });
