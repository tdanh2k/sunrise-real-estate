import z from "zod";
import { dbContext } from "../../utils/prisma";
import { AddGlobalBlogTypeSchema } from "../../schemas/AddGlobalBlogType.schema";
import { PaginationSchema } from "../../schemas/Pagination.schema";
import { protectedProcedure, trpcRouter } from "../router";

export const GlobalBlogTypeRouter = trpcRouter.router({
  all: protectedProcedure
    .input(z.void())
    //.output(APIResponseSchema(z.array(GlobalBlogTypeSchema)))
    .query(async () => {
      const data = await dbContext.globalBlogType.findMany();

      return {
        data,
      };
      // return await APIResponseSchema(z.array(GlobalBlogTypeSchema)).parseAsync({
      //   data,
      // });
    }),
  nextIdx: protectedProcedure
    .input(z.void())
    // .output(
    //   APIResponseSchema(z.object({ Idx: NonNegativeIntegerNumber.nullable() }))
    // )
    .query(async () => {
      const data = await dbContext.globalBlogType.aggregate({
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
    //.output(APIResponseSchema(z.array(GlobalBlogTypeSchema)))
    .query(async ({ input }) => {
      const page_index = input.paging.page_index ?? 0;
      const page_size = input.paging.page_size ?? 10;

      const [data, row_count] = await dbContext.$transaction([
        dbContext.globalBlogType.findMany({
          skip: page_index,
          take: page_size,
        }),
        dbContext.globalBlogType.count(),
      ]);

      return {
        data,
        paging: {
          page_index,
          page_size,
          row_count,
        },
      };
      // return await APIResponseSchema(z.array(GlobalBlogTypeSchema)).parseAsync({
      //   data,
      //   paging: {
      //     page_index,
      //     page_size,
      //     row_count,
      //   },
      // });
    }),
  create: protectedProcedure
    .input(AddGlobalBlogTypeSchema)
    //.output(APIResponseSchema(GlobalBlogTypeSchema.nullable()))
    .mutation(async ({ input }) => {
      //if (ctx.userId == null) return null;
      const data = await dbContext.globalBlogType.create({
        data: input,
      });

      return { data };
      // return await APIResponseSchema(
      //   GlobalBlogTypeSchema.nullable()
      // ).parseAsync({ data });
    }),
});
