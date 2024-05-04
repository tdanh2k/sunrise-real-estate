import { z } from "zod";
import { NonNegativeIntegerNumber } from "../utils/ZodUtils.js";
export const APIResponseSchema = (dataSchema) => z.object({
    data: dataSchema,
    paging: z
        .object({
        page_size: NonNegativeIntegerNumber,
        page_index: NonNegativeIntegerNumber,
        row_count: NonNegativeIntegerNumber,
    })
        .optional(),
});
