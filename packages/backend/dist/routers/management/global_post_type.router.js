import z from "zod";
import { dbContext } from "../../utils/prisma.js";
import { AddGlobalPostTypeSchema } from "../../schemas/AddGlobalPostType.schema.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { GlobalPostTypeSchema } from "../../schemas/GlobalPostType.schema.js";
export const GlobalPostTypeRouter = trpcRouter.router({
    all: protectedProcedure.input(z.void()).query(async () => {
        const data = await dbContext.globalPostType.findMany();
        return {
            data,
        };
    }),
    nextIdx: protectedProcedure.input(z.void()).query(async () => {
        const data = await dbContext.globalPostType.aggregate({
            _max: {
                Idx: true,
            },
        });
        const result = {
            Idx: data?._max?.Idx + 1 ?? 1,
        };
        return { data: result };
    }),
    byPage: protectedProcedure
        .input(PaginationSchema)
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
    }),
    create: protectedProcedure
        .input(AddGlobalPostTypeSchema)
        .mutation(async ({ input }) => {
        const data = await dbContext.globalPostType.create({
            data: input,
        });
        return { data };
    }),
    update: protectedProcedure
        .input(GlobalPostTypeSchema)
        .mutation(async ({ input }) => {
        const data = await dbContext.globalPostType.update({
            data: input,
            where: {
                Id: input.Id,
            },
        });
        return { data };
    }),
    delete: protectedProcedure
        .input(z.object({ Id: RequiredString }))
        .mutation(async ({ input: { Id } }) => {
        const result = await dbContext.globalPostType.delete({
            where: {
                Id,
            },
        });
        return {
            data: result,
        };
    }),
});
