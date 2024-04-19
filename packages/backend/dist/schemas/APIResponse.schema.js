"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIResponseSchema = void 0;
const zod_1 = require("zod");
const ZodUtils_1 = require("../utils/ZodUtils");
const APIResponseSchema = (dataSchema) => zod_1.z.object({
    data: dataSchema,
    paging: zod_1.z
        .object({
        page_size: ZodUtils_1.NonNegativeIntegerNumber,
        page_index: ZodUtils_1.NonNegativeIntegerNumber,
        row_count: ZodUtils_1.NonNegativeIntegerNumber,
    })
        .optional(),
});
exports.APIResponseSchema = APIResponseSchema;
