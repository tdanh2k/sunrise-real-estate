import { z } from "zod";
import {
  NonNegativeIntegerNumber,
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
