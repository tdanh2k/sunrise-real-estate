"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationSchema = void 0;
const zod_1 = require("zod");
const ZodUtils_1 = require("../utils/ZodUtils");
exports.PaginationSchema = zod_1.z.object({
    paging: zod_1.z.object({
        page_size: ZodUtils_1.NonNegativeIntegerNumber,
        page_index: ZodUtils_1.NonNegativeIntegerNumber,
    }),
    filters: zod_1.z
        .array(zod_1.z.object({
        column_name: ZodUtils_1.RequiredString,
        operator_type: ZodUtils_1.OptionalString,
        value: ZodUtils_1.OptionalString.or(ZodUtils_1.OptionalNumber),
    }))
        .optional(),
}).passthrough();
