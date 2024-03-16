import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalDate,
  RequiredString,
} from "../utils/ZodUtils";

export const AddGlobalBlogTypeSchema = z.object({
  Idx: NonNegativeIntegerNumber,
  Name: RequiredString,
  CreatedDate: OptionalDate,
});
