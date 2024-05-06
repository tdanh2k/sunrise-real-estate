"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const test = client_1.Prisma.validator()({
    include: {
        PostCurrentDetail: true,
        PostFeature: true,
        PostImage: true,
        PostType: true,
    },
});
