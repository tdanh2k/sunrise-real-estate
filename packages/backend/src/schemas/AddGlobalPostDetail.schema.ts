import { z } from "zod";
import {
  OptionalJsDate,
  RequiredBoolean,
  RequiredString,
} from "../utils/ZodUtils";

export const AddGlobalPostDetailSchema = z.object({
  Code: RequiredString,
  Name: RequiredString,
  Unit: RequiredString,
  IsNumber: RequiredBoolean,
  CreatedDate: OptionalJsDate,
});

export type TypeAddGlobalPostDetail = z.infer<typeof AddGlobalPostDetailSchema>;
