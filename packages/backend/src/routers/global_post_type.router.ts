import z from "zod";
import { TType, t } from ".";
import { dbContext } from "../utils/prisma";
import { GlobalPostTypeSchema } from "../schemas/GlobalPostType.schema";
import { AddGlobalPostTypeSchema } from "../schemas/AddGlobalPostType.schema";
import { NonNegativeIntegerNumber, OptionalDate } from "../utils/ZodUtils";
import { PaginationSchema } from "../schemas/Pagination.schema";
import { APIResponseSchema } from "../schemas/APIResponse.schema";

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
      .output(APIResponseSchema(z.array(GlobalPostTypeSchema)))
      .query(async (opt) => {
        const data = await dbContext.globalPostType.findMany();

        return await APIResponseSchema(
          z.array(GlobalPostTypeSchema)
        ).parseAsync({ data });
      }),
    nextIdx: t.procedure
      .meta({
        /* 👉 */ openapi: {
          method: "GET",
          path: "/trpc/global_post_type.next_idx",
          tags: ["global_post_type"],
        },
      })
      .input(z.void())
      .output(
        APIResponseSchema(
          z.object({ Idx: NonNegativeIntegerNumber.nullable() })
        )
      )
      .query(async (opt) => {
        const data = await dbContext.globalPostType.aggregate({
          _max: {
            Idx: true,
          },
        });

        const result = {
          Idx: (data?._max?.Idx as number) + 1 ?? 1,
        };

        return await APIResponseSchema(
          z.object({ Idx: NonNegativeIntegerNumber.nullable() })
        ).parseAsync({ data: result });
      }),
    byPage: t.procedure
      // .meta({
      //   /* 👉 */ openapi: { method: "GET", path: "/trpc/post.byPage", tags: ["post"]  },
      // })
      .input(PaginationSchema)
      .output(APIResponseSchema(z.array(GlobalPostTypeSchema)))
      .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 0;
        const page_size = input.paging.page_size ?? 10;

        const [data, row_count] = await dbContext.$transaction([
          dbContext.globalPostType.findMany({
            skip: page_index,
            take: page_size,
          }),
          dbContext.globalPostType.count(),
        ]);

        return await APIResponseSchema(
          z.array(GlobalPostTypeSchema)
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
          path: "/trpc/global_post_type.create",
          tags: ["global_post_type"],
        },
      })
      .input(AddGlobalPostTypeSchema)
      .output(APIResponseSchema(GlobalPostTypeSchema.nullable()))
      .mutation(async ({ ctx, input }) => {
        //if (ctx.userId == null) return null;
        const data = await dbContext.globalPostType.create({
          data: input,
        });

        return await APIResponseSchema(
          GlobalPostTypeSchema.nullable()
        ).parseAsync({ data });
      }),
  });
