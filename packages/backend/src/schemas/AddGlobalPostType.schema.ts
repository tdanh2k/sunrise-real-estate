import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalJsDate,
  RequiredString,
} from "../utils/ZodUtils";

export const AddGlobalPostTypeSchema = z.object({
  Idx: NonNegativeIntegerNumber,
  Name: RequiredString,
  //CreatedDate: OptionalJsDate,
});

export type TypeAddGlobalPostType = z.infer<typeof AddGlobalPostTypeSchema>;
