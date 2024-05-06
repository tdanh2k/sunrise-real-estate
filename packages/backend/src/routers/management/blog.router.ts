import z from "zod";
import { BlogSchema, TypeBlog } from "../../schemas/Blog.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { AddBlogSchema } from "../../schemas/AddBlog.schema.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { TypeAPIResponse } from "../../schemas/APIResponse.schema.js";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, trpcRouter } from "../router.js";
import axios from "axios";
import { TypeAuth0User } from "../../schemas/Auth0User.schema.js";

export const BlogRouter = trpcRouter.router({
  all: protectedProcedure
    .input(z.void())
    //.output(APIResponseSchema(z.array(BlogSchema)))
    .query(async () => {
      const data = await dbContext.blog.findMany({
        include: {
          BlogImage: true,
          GlobalBlogType: true,
        },
      });

      return {
        data,
      } as TypeAPIResponse<TypeBlog[]>;
      // return await APIResponseSchema(z.array(BlogSchema)).parseAsync({
      //   data,
      // });
    }),
  byPage: protectedProcedure
    .input(PaginationSchema)
    //.output(APIResponseSchema(z.array(BlogSchema)))
    .query(async ({ input }) => {
      const page_index = input.paging.page_index ?? 1;
      const page_size = input.paging.page_size ?? 10;

      const [data, row_count] = await dbContext.$transaction([
        dbContext.blog.findMany({
          skip: page_index,
          take: page_size,
          include: {
            BlogImage: true,
            GlobalBlogType: true,
          },
        }),
        dbContext.blog.count(),
      ]);

      return {
        data,
        paging: {
          page_index,
          page_size,
          row_count,
        },
      } as TypeAPIResponse<TypeBlog[]>;
      // return await APIResponseSchema(z.array(BlogSchema)).parseAsync({
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
    //.output(APIResponseSchema(BlogSchema.nullable()))
    .query(async ({ input }) => {
      const data = await dbContext.blog.findFirst({
        where: {
          Id: input.Id,
        },
        include: {
          BlogImage: true,
          GlobalBlogType: true,
        },
      });

      return {
        data,
      } as TypeAPIResponse<TypeBlog>;
      // return await APIResponseSchema(BlogSchema.nullable()).parseAsync({
      //   data,
      // });
    }),
  publish: protectedProcedure
    .input(AddBlogSchema)
    // .output(
    //   APIResponseSchema(
    //     BlogSchema.omit({
    //       BlogCurrentDetail: true,
    //       BlogFeature: true,
    //       BlogImage: true,
    //     }).nullable()
    //   )
    // )
    .mutation(async ({ ctx, input: { BlogImage, ...rest } }) => {
      if ((await ctx).userId == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const response = await axios<TypeAuth0User>({
        url: `${(await ctx).domain}api/v2/users/${(await ctx).userId}`,
        method: "GET",
        params: {
          search_engine: "v3",
        },
        headers: {
          Authorization: `Bearer ${(await ctx).management_token}`,
        },
      });

      const user = response?.data;

      if (user == null)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ``,
        });

      const result = await dbContext.blog.create({
        data: {
          ...rest,
          UserId: (await ctx).userId ?? "",
          BlogImage: {
            // connectOrCreate: BlogImage?.map((item) => ({
            //   where: {
            //     Id: item.Id,
            //   },
            //   create: item,
            // })),
            createMany: {
              data: BlogImage ?? [],
            },
          },
        },
        include: {
          BlogImage: true,
          BlogStats: true,
          GlobalBlogType: true,
        },
      });

      return { data: result } as TypeAPIResponse<TypeBlog>;
      // return await APIResponseSchema(
      //   BlogSchema.omit({
      //     BlogCurrentDetail: true,
      //     BlogFeature: true,
      //     BlogImage: true,
      //   }).nullable()
      // ).parseAsync({ data: result });
    }),
  update: protectedProcedure
    .input(BlogSchema.omit({ GlobalBlogType: true }))
    // .output(
    //   APIResponseSchema(
    //     BlogSchema.omit({
    //       BlogCurrentDetail: true,
    //       BlogFeature: true,
    //       BlogImage: true,
    //     }).nullable()
    //   )
    // )
    .mutation(async ({ input: { Id, BlogImage, ...rest } }) => {
      //if (ctx.userId == null) return null;

      const result = await dbContext.blog.update({
        where: {
          Id,
        },
        data: {
          ...rest,
          BlogImage: {
            connectOrCreate: BlogImage?.map((item) => ({
              where: {
                Id: item.Id,
              },
              create: item,
            })),
          },
        },
        include: {
          BlogImage: true,
          BlogStats: true,
          GlobalBlogType: true,
        },
      });

      return { data: result } as TypeAPIResponse<TypeBlog>;
      // return await APIResponseSchema(
      //   BlogSchema.omit({
      //     BlogCurrentDetail: true,
      //     BlogFeature: true,
      //     BlogImage: true,
      //   }).nullable()
      // ).parseAsync({ data: result });
    }),
});
