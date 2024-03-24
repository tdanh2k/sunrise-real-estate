import { z } from "zod";
import { NonNegativeIntegerNumber } from "../utils/ZodUtils";

export const APIResponseSchema = (dataSchema: z.ZodSchema) =>
  z.object({
    data: dataSchema,
    paging: z.object({
      page_size: NonNegativeIntegerNumber,
      page_index: NonNegativeIntegerNumber,
      row_count: NonNegativeIntegerNumber
    }).optional(),
  });

export type TypeAPIResponse<T extends Record<string, unknown> | Record<string, unknown>[]> = z.infer<
  ReturnType<typeof APIResponseSchema>
> & { data: T };
