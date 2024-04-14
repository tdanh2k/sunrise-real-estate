import z from "zod";
import { dbContext } from "../../utils/prisma";
import { GlobalPostDetailSchema } from "../../schemas/GlobalPostDetail.schema";
import { APIResponseSchema } from "../../schemas/APIResponse.schema";
import { protectedProcedure, trpcRouter } from "../router";

export const GlobalPostDetailRouter = trpcRouter.router({
  all: protectedProcedure
    .meta({
      /* 👉 */ openapi: {
        method: "GET",
        path: "/user/global_post_detail.all",
        tags: ["global_post_detail"],
      },
    })
    .input(z.void())
    .output(APIResponseSchema(z.array(GlobalPostDetailSchema)))
    .query(async (opt) => {
      const data = await dbContext.globalPostDetail.findMany();

      return await APIResponseSchema(
        z.array(GlobalPostDetailSchema)
      ).parseAsync({ data });
    }),
});
