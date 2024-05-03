import z from "zod";
import { dbContext } from "../../utils/prisma";
import {
  TypeGlobalBlogType,
} from "../../schemas/GlobalBlogType.schema";
import {
  TypeAPIResponse,
} from "../../schemas/APIResponse.schema";
import { protectedProcedure, trpcRouter } from "../router";

export const GlobalBlogTypeRouter = trpcRouter.router({
  all: protectedProcedure
    .input(z.void())
    //.output(APIResponseSchema(z.array(GlobalBlogTypeSchema)))
    .query(async (opt) => {
      const data = await dbContext.globalBlogType.findMany();

      return {
        data,
      } as TypeAPIResponse<TypeGlobalBlogType[]>;
      // return await APIResponseSchema(z.array(GlobalBlogTypeSchema)).parseAsync({
      //   data,
      // });
    }),
  nextIdx: protectedProcedure
    .input(z.void())
    // .output(
    //   APIResponseSchema(z.object({ Idx: NonNegativeIntegerNumber.nullable() }))
    // )
    .query(async (opt) => {
      const data = await dbContext.globalBlogType.aggregate({
        _max: {
          Idx: true,
        },
      });

      const result = {
        Idx: (data?._max?.Idx as number) + 1 ?? 1,
      };

      return { data: result } as TypeAPIResponse<{ Idx: number }>;
      // return await APIResponseSchema(
      //   z.object({ Idx: NonNegativeIntegerNumber.nullable() })
      // ).parseAsync({ data: result });
    }),
});
