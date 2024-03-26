import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalJsDate,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils";

export const GlobalPostTypeSchema = z.object({
  Id: RequiredUUID,
  Idx: NonNegativeIntegerNumber,
  Name: RequiredString,
  CreatedDate: OptionalJsDate,
});

export type TypeGlobalPostType = z.infer<typeof GlobalPostTypeSchema>;
