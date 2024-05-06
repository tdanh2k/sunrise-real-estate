import z from "zod";
import { BlogSchema } from "../../schemas/Blog.schema.js";
import { dbContext } from "../../utils/prisma.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, trpcRouter } from "../router.js";
export const BlogRouter = trpcRouter.router({
    byPage: protectedProcedure
        .input(PaginationSchema)
        //.output(APIResponseSchema(z.array(BlogSchema)))
        .query(async ({ ctx, input }) => {
        if ((await ctx).userId == null)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
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
                where: {
                    UserId: (await ctx).userId,
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
        };
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
        .input(z.object({
        Id: RequiredString,
    }))
        //.output(APIResponseSchema(BlogSchema.nullable()))
        .query(async ({ ctx, input }) => {
        if ((await ctx).userId == null)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await dbContext.blog.findFirst({
            where: {
                Id: input.Id,
                UserId: (await ctx).userId,
            },
            include: {
                BlogImage: true,
                GlobalBlogType: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(BlogSchema.nullable()).parseAsync({
        //   data,
        // });
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
                GlobalBlogType: true,
            },
        });
        return { data: result };
        // return await APIResponseSchema(
        //   BlogSchema.omit({
        //     BlogCurrentDetail: true,
        //     BlogFeature: true,
        //     BlogImage: true,
        //   }).nullable()
        // ).parseAsync({ data: result });
    }),
});
