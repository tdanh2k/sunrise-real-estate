import { z } from "zod";
import { OptionalJsDate, RequiredBoolean, RequiredString, } from "../utils/ZodUtils.js";
export const AddGlobalPostDetailSchema = z.object({
    Name: RequiredString,
    Unit: RequiredString,
    IsNumber: RequiredBoolean,
    CreatedDate: OptionalJsDate,
});
