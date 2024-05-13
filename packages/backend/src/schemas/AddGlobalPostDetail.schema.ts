import { z } from "zod";
import {
  OptionalJsDate,
  OptionalString,
  RequiredBoolean,
  RequiredString,
} from "../utils/ZodUtils.js";

export const AddGlobalPostDetailSchema = z.object({
  Code: OptionalString,
  Name: RequiredString,
  Unit: RequiredString,
  IsNumber: RequiredBoolean,
  CreatedDate: OptionalJsDate,
});

export type TypeAddGlobalPostDetail = z.infer<typeof AddGlobalPostDetailSchema>;
