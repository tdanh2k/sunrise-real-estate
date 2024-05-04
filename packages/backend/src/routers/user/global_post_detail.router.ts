import z from "zod";
import { dbContext } from "../../utils/prisma.js";
import { TypeGlobalPostDetail } from "../../schemas/GlobalPostDetail.schema.js";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";

export const GlobalPostDetailRouter = trpcRouter.router({
  all: protectedProcedure
    .input(z.void())
    //.output(APIResponseSchema(z.array(GlobalPostDetailSchema)))
    .query(async () => {
      const data = await dbContext.globalPostDetail.findMany();

      return { data } as TypeAPIResponse<TypeGlobalPostDetail[]>;
      // return await APIResponseSchema(
      //   z.array(GlobalPostDetailSchema)
      // ).parseAsync({ data });
    }),
});
