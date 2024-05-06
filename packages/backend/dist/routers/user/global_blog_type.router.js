import z from "zod";
import { dbContext } from "../../utils/prisma.js";
import { protectedProcedure, trpcRouter } from "../router.js";
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
            Idx: data?._max?.Idx + 1 ?? 1,
        };
        return { data: result };
        // return await APIResponseSchema(
        //   z.object({ Idx: NonNegativeIntegerNumber.nullable() })
        // ).parseAsync({ data: result });
    }),
});
