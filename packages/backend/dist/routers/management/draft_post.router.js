import { TRPCError } from "@trpc/server";
import z from "zod";
import { AddDraftPostSchema } from "../../schemas/AddDraftPost.schema.js";
import { DraftPostSchema } from "../../schemas/DraftPost.schema.js";
import { PaginationSchema } from "../../schemas/Pagination.schema.js";
import { RequiredString } from "../../utils/ZodUtils.js";
import { dbContext } from "../../utils/prisma.js";
import { protectedProcedure, trpcRouter } from "../router.js";
export const DraftPostRouter = trpcRouter.router({
    all: protectedProcedure
        .input(z.void())
        //.output(APIResponseSchema(z.array(DraftPostSchema)))
        .query(async () => {
        const data = await dbContext.draftPost.findMany({
            include: {
                DraftPostCurrentDetail: {
                    include: {
                        GlobalPostDetail: true,
                    },
                },
                DraftPostImage: true,
                GlobalPostType: true,
                DraftPostFeature: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(z.array(DraftPostSchema)).parseAsync({
        //   data,
        // });
    }),
    byPage: protectedProcedure
        .input(PaginationSchema)
        //.output(APIResponseSchema(z.array(DraftPostSchema)))
        .query(async ({ input }) => {
        const page_index = input.paging.page_index ?? 1;
        const page_size = input.paging.page_size ?? 10;
        const [data, row_count] = await dbContext.$transaction([
            dbContext.draftPost.findMany({
                skip: page_index,
                take: page_size,
                include: {
                    DraftPostCurrentDetail: {
                        include: {
                            GlobalPostDetail: true,
                        },
                    },
                    DraftPostImage: true,
                    DraftPostFeature: true,
                },
            }),
            dbContext.draftPost.count(),
        ]);
        return {
            data,
            paging: {
                page_index,
                page_size,
                row_count,
            },
        };
        // return await APIResponseSchema(z.array(DraftPostSchema)).parseAsync({
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
        //.output(APIResponseSchema(DraftPostSchema.nullable()))
        .query(async ({ input }) => {
        const data = await dbContext.draftPost.findFirst({
            where: {
                Id: input.Id,
            },
            include: {
                DraftPostCurrentDetail: {
                    include: {
                        GlobalPostDetail: true,
                    },
                },
                DraftPostImage: true,
                GlobalPostType: true,
                DraftPostFeature: true,
            },
        });
        return {
            data,
        };
        // return await APIResponseSchema(DraftPostSchema.nullable()).parseAsync({
        //   data,
        // });
    }),
    create: protectedProcedure
        .input(AddDraftPostSchema)
        // .output(
        //   APIResponseSchema(
        //     DraftPostSchema.omit({
        //       DraftPostCurrentDetail: true,
        //       DraftPostFeature: true,
        //       DraftPostImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ ctx, input: { DraftPostCurrentDetail, DraftPostFeature, DraftPostImage, ...rest }, }) => {
        if ((await ctx).userId == null)
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: ``,
            });
        const data = await dbContext.draftPost.create({
            data: {
                ...rest,
                Title: rest?.Title ?? "",
                Description: rest?.Description ?? "",
                Address: rest?.Address ?? "",
                MapUrl: rest?.MapUrl ?? "",
                UserId: (await ctx).userId ?? "",
                DraftPostCurrentDetail: {
                    createMany: {
                        data: DraftPostCurrentDetail,
                    },
                    // connectOrCreate: DraftPostCurrentDetail?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                },
                DraftPostFeature: {
                    createMany: {
                        data: DraftPostFeature,
                    },
                    // connectOrCreate: DraftPostFeature?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                },
                DraftPostImage: {
                    createMany: {
                        data: DraftPostImage,
                    },
                    // connectOrCreate: DraftPostImage?.map((item) => ({
                    //   where: {
                    //     Id: item.Id,
                    //   },
                    //   create: item,
                    // })),
                },
            },
        });
        return { data };
        // return await APIResponseSchema(
        //   DraftPostSchema.omit({
        //     DraftPostCurrentDetail: true,
        //     DraftPostFeature: true,
        //     DraftPostImage: true,
        //   }).nullable()
        // ).parseAsync({ data });
    }),
    update: protectedProcedure
        .input(DraftPostSchema.omit({ GlobalPostType: true }))
        // .output(
        //   APIResponseSchema(
        //     DraftPostSchema.omit({
        //       DraftPostCurrentDetail: true,
        //       DraftPostFeature: true,
        //       DraftPostImage: true,
        //     }).nullable()
        //   )
        // )
        .mutation(async ({ input: { Id, DraftPostCurrentDetail, DraftPostFeature, DraftPostImage, ...rest }, }) => {
        //if (ctx.userId == null) return null;
        const result = await dbContext.draftPost.update({
            where: {
                Id,
            },
            data: {
                ...rest,
                DraftPostCurrentDetail: {
                    connectOrCreate: DraftPostCurrentDetail?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
                DraftPostFeature: {
                    connectOrCreate: DraftPostFeature?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
                DraftPostImage: {
                    connectOrCreate: DraftPostImage?.map((item) => ({
                        where: {
                            Id: item.Id,
                        },
                        create: item,
                    })),
                },
            },
        });
        return { data: result };
        // return await APIResponseSchema(
        //   DraftPostSchema.omit({
        //     DraftPostCurrentDetail: true,
        //     DraftPostFeature: true,
        //     DraftPostImage: true,
        //   })
        // ).parseAsync({ data: result });
    }),
    delete: protectedProcedure
        .input(z.object({ Id: RequiredString }))
        //.output(APIResponseSchema(OptionalBoolean.nullable()))
        .mutation(async ({ input: { Id } }) => {
        //if (ctx.userId == null) return null;
        const result = await dbContext.draftPost.delete({
            where: {
                Id,
            },
        });
        return {
            data: result,
        };
        // return await APIResponseSchema(OptionalBoolean.nullable()).parseAsync({
        //   data: Boolean(result),
        // });
    }),
});
