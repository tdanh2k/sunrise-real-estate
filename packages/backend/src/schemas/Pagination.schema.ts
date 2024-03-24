
import { z } from "zod";
import { NonNegativeIntegerNumber, OptionalNumber, OptionalString, RequiredString } from "../utils/ZodUtils";

export const PaginationSchema = z.object({
  paging: z.object({
    page_size: NonNegativeIntegerNumber,
    page_index: NonNegativeIntegerNumber,
  }),
  filters: z
    .array(
      z.object({
        column_name: RequiredString,
        operator_type: OptionalString,
        value: OptionalString.or(OptionalNumber),
      })
    )
    .optional(),
}).passthrough();

export type TypePagination = z.infer<typeof PaginationSchema>;
