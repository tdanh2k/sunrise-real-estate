import { z } from "zod";
import {
  OptionalBoolean,
  OptionalJsDate,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils";

export const GlobalPostDetailSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Name: RequiredString,
  Unit: RequiredString,
  IsNumber: OptionalBoolean,
  CreatedDate: OptionalJsDate,
});

export type TypeGlobalPostDetail = z.infer<typeof GlobalPostDetailSchema>;
