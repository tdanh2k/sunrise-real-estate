import z from "zod";
import { dbContext } from "../../utils/prisma.js";
import { AddGlobalPostTypeSchema } from "../../schemas/AddGlobalPostType.schema.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { RequiredString } from "../../utils/ZodUtils.js";

export const GlobalPostTypeRouter = trpcRouter.router({
  all: protectedProcedure
    .input(z.void())
    //.output(APIResponseSchema(z.array(GlobalPostTypeSchema)))
    .query(async () => {
      const data = await dbContext.globalPostType.findMany();

      return {
        data,
      };
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

      return { data: result };
      // return await APIResponseSchema(
      //   z.object({ Idx: NonNegativeIntegerNumber.nullable() })
      // ).parseAsync({ data: result });
    }),
  byPage: protectedProcedure
    .input(PaginationSchema)
    //.output(APIResponseSchema(z.array(GlobalPostTypeSchema)))
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

      return {
        data,
        paging: {
          page_index,
          page_size,
          row_count,
        },
      };
      // return await APIResponseSchema(z.array(GlobalPostTypeSchema)).parseAsync({
      //   data,
      //   paging: {
      //     page_index,
      //     page_size,
      //     row_count,
      //   },
      // });
    }),
  create: protectedProcedure
    .input(AddGlobalPostTypeSchema)
    //.output(APIResponseSchema(GlobalPostTypeSchema.nullable()))
    .mutation(async ({ input }) => {
      //if (ctx.userId == null) return null;
      const data = await dbContext.globalPostType.create({
        data: input,
      });

      return { data };
      // return await APIResponseSchema(
      //   GlobalPostTypeSchema.nullable()
      // ).parseAsync({ data });
    }),
  delete: protectedProcedure
    .input(z.object({ Id: RequiredString }))
    //.output(APIResponseSchema(OptionalBoolean.nullable()))
    .mutation(async ({ input: { Id } }) => {
      //if (ctx.userId == null) return null;
      const result = await dbContext.globalPostType.delete({
        where: {
          Id,
        },
      });
      return {
        data: result,
      };
      // return await APIResponseSchema(OptionalBoolean.nullable()).parseAsync({
      //   data: Boolean(result),
      // });
    }),
});
