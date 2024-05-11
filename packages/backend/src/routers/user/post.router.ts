import z from "zod";
import { PostSchema, TypePost } from "../../schemas/Post.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema.js";
import { protectedProcedure, trpcRouter } from "../router.js";

export const PostRouter = trpcRouter.router({
  byPage: protectedProcedure
    .input(PaginationSchema)
    //.output(APIResponseSchema(z.array(PostSchema)))
    .query(async ({ input }) => {
      const page_index = input.paging.page_index ?? 1;
      const page_size = input.paging.page_size ?? 10;

      const [data, row_count] = await dbContext.$transaction([
        dbContext.post.findMany({
          skip: page_index,
          take: page_size,
          include: {
            PostCurrentDetail: true,
            PostImage: true,
            PostType: true,
            PostFeature: true,
          },
        }),
        dbContext.post.count(),
      ]);

      return {
        data,
        paging: {
          page_index,
          page_size,
          row_count,
        },
      } as TypeAPIResponse<TypePost[]>;
      // return await APIResponseSchema(z.array(PostSchema)).parseAsync({
      //   data,
      //   paging: {
      //     page_index,
      //     page_size,
      //     row_count,
      //   },
      // });
    }),
  byId: protectedProcedure
    .input(
      z.object({
        Id: RequiredString,
      })
    )
    //.output(APIResponseSchema(PostSchema.nullable()))
    .query(async ({ input }) => {
      const data = await dbContext.post.findFirst({
        where: {
          Id: input.Id,
        },
        include: {
          PostCurrentDetail: true,
          PostImage: true,
          PostType: true,
          PostFeature: true,
        },
      });

      return {
        data,
      } as TypeAPIResponse<TypePost>;
      // return await APIResponseSchema(PostSchema.nullable()).parseAsync({
      //   data,
      // });
    }),
  update: protectedProcedure
    .input(PostSchema.omit({ PostType: true }))
    // .output(
    //   APIResponseSchema(
    //     PostSchema.omit({
    //       PostCurrentDetail: true,
    //       PostFeature: true,
    //       PostImage: true,
    //     }).nullable()
    //   )
    // )
    .mutation(
      async ({
        input: { Id, PostCurrentDetail, PostFeature, PostImage, ...rest },
      }) => {
        //if (ctx.userId == null) return null;

        const result = await dbContext.post.update({
          where: {
            Id,
          },
          data: {
            ...rest,
            PostCurrentDetail: {
              connectOrCreate: PostCurrentDetail?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
            PostFeature: {
              connectOrCreate: PostFeature?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
            PostImage: {
              connectOrCreate: PostImage?.map((item) => ({
                where: {
                  Id: item.Id,
                },
                create: item,
              })),
            },
          },
          include: {
            PostCurrentDetail: true,
            PostFeature: true,
            PostImage: true,
          },
        });

        return { data: result } as TypeAPIResponse<TypePost>;
        // return await APIResponseSchema(
        //   PostSchema.omit({
        //     PostCurrentDetail: true,
        //     PostFeature: true,
        //     PostImage: true,
        //   }).nullable()
        // ).parseAsync({ data: result });
      }
    ),
});
