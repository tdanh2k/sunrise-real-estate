import z from "zod";
import { NonNegativeIntegerNumber, OptionalJsDate, RequiredString, RequiredUUID, } from "../utils/ZodUtils.js";
export const GlobalBlogTypeSchema = z.object({
    Id: RequiredUUID,
    Idx: NonNegativeIntegerNumber,
    Name: RequiredString,
    CreatedDate: OptionalJsDate,
});
