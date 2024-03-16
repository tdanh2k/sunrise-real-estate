import { Prisma } from "@prisma/client";

const test = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    PostCurrentDetail: true,
    PostFeature: true,
    PostImage: true,
    PostType: true,
  },
});

export type Test = Prisma.PostGetPayload<typeof test>;
