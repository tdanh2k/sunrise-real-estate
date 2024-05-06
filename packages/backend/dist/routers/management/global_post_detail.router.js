import z from "zod";
import { dbContext } from "../../utils/prisma.js";
import { AddGlobalPostDetailSchema } from "../../schemas/AddGlobalPostDetail.schema.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
export const GlobalPostDetailRouter = trpcRouter.router({
    all: protectedProcedure
        .input(z.void())
        //.output(APIResponseSchema(z.array(GlobalPostDetailSchema)))
        .query(async () => {
        const data = await dbContext.globalPostDetail.findMany();
        return { data };
        // return await APIResponseSchema(
        //   z.array(GlobalPostDetailSchema)
        // ).parseAsync({ data });
    }),
    byPage: protectedProcedure
        .input(PaginationSchema)
        //.output(APIResponseSchema(z.array(GlobalPostDetailSchema)))
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
        return {
            data,
            paging: {
                page_index,
                page_size,
                row_count,
            },
        };
        // return await APIResponseSchema(
        //   z.array(GlobalPostDetailSchema)
        // ).parseAsync({
        //   data,
        //   paging: {
        //     page_index,
        //     page_size,
        //     row_count,
        //   },
        // });
    }),
    create: protectedProcedure
        .input(AddGlobalPostDetailSchema)
        //.output(APIResponseSchema(GlobalPostDetailSchema.nullable()))
        .mutation(async ({ input }) => {
        //if (ctx.userId == null) return null;
        const data = await dbContext.globalPostDetail.create({
            data: input,
        });
        return { data };
        // return await APIResponseSchema(
        //   GlobalPostDetailSchema.nullable()
        // ).parseAsync({ data });
    }),
});
