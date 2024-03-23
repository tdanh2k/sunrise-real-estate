import { z } from "zod";
import {
  OptionalBoolean,
  OptionalJsDate,
  RequiredString,
} from "../utils/ZodUtils";

export const AddGlobalPostDetailSchema = z.object({
  Code: RequiredString,
  Name: RequiredString,
  Unit: RequiredString,
  IsNumber: OptionalBoolean,
  CreatedDate: OptionalJsDate,
});
