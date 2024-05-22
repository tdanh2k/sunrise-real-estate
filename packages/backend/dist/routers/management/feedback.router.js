import { z } from "zod";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { protectedProcedure, trpcRouter } from "../router.js";
import { RequiredString } from "../../utils/ZodUtils.js";
export const FeedbackRouter = trpcRouter.router({
    byPage: protectedProcedure
        .input(PaginationSchema)
        .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 0;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await dbContext.$transaction([
            dbContext.feedback.findMany({
                skip: page_index,
                take: page_size,
            }),
            dbContext.feedback.count(),
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
    byId: protectedProcedure
        .input(z.object({
        Id: RequiredString,
    }))
        .query(async ({ input }) => {
        const data = await dbContext.feedback.findFirst({
            where: {
                Id: input?.Id ?? "00000000-0000-0000-0000-000000000000",
            },
        });
        return { data };
    }),
    delete: protectedProcedure
        .input(z.object({
        Id: RequiredString,
    }))
        .mutation(async ({ input }) => {
        const data = await dbContext.feedback.delete({
            where: {
                Id: input?.Id ?? "00000000-0000-0000-0000-000000000000",
            },
        });
        return { data };
    }),
});
