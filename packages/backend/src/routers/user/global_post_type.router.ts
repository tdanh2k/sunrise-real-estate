import z from "zod";
import { dbContext } from "../../utils/prisma";
import { GlobalPostTypeSchema } from "../../schemas/GlobalPostType.schema";
import { NonNegativeIntegerNumber } from "../../utils/ZodUtils";
import { APIResponseSchema } from "../../schemas/APIResponse.schema";
import { protectedProcedure, trpcRouter } from "../router";

export const GlobalPostTypeRouter = trpcRouter.router({
  all: protectedProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/user/global_post_type.all",
        tags: ["global_post_type"],
      },
    })
    .input(z.void())
    .output(APIResponseSchema(z.array(GlobalPostTypeSchema)))
    .query(async (opt) => {
      const data = await dbContext.globalPostType.findMany();

      return await APIResponseSchema(z.array(GlobalPostTypeSchema)).parseAsync({
        data,
      });
    }),
  nextIdx: protectedProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/user/global_post_type.next_idx",
        tags: ["global_post_type"],
      },
    })
    .input(z.void())
    .output(
      APIResponseSchema(z.object({ Idx: NonNegativeIntegerNumber.nullable() }))
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
});
