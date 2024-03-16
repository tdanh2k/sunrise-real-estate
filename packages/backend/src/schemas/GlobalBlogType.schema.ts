import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalDate,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils";

export const GlobalBlogTypeSchema = z.object({
  Id: RequiredUUID,
  Idx: NonNegativeIntegerNumber,
  Name: RequiredString,
  CreatedDate: OptionalDate,
});
