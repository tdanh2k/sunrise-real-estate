import z from "zod";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema";
import { TypeGlobalPostType } from "../../schemas/GlobalPostType.schema";
import { dbContext } from "../../utils/prisma";
import { protectedProcedure, trpcRouter } from "../router";

export const GlobalPostTypeRouter = trpcRouter.router({
  all: protectedProcedure
    .input(z.void())
    //.output(APIResponseSchema(z.array(GlobalPostTypeSchema)))
    .query(async () => {
      const data = await dbContext.globalPostType.findMany();

      return {
        data,
      } as TypeAPIResponse<TypeGlobalPostType[]>;
      // return await APIResponseSchema(z.array(GlobalPostTypeSchema)).parseAsync({
      //   data,
      // });
    }),
  nextIdx: protectedProcedure
    .input(z.void())
    // .output(
    //   APIResponseSchema(z.object({ Idx: NonNegativeIntegerNumber.nullable() }))
    // )
    .query(async () => {
      const data = await dbContext.globalPostType.aggregate({
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
