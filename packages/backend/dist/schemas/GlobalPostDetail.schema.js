import { z } from "zod";
import { OptionalBoolean, OptionalJsDate, RequiredString, RequiredUUID, } from "../utils/ZodUtils.js";
export const GlobalPostDetailSchema = z.object({
    Id: RequiredUUID,
    Name: RequiredString,
    Unit: RequiredString,
    IsNumber: OptionalBoolean,
    CreatedDate: OptionalJsDate,
});
