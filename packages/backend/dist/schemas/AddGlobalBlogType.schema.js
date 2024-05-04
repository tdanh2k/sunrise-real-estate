import z from "zod";
import { NonNegativeIntegerNumber, OptionalJsDate, RequiredString, } from "../utils/ZodUtils.js";
export const AddGlobalBlogTypeSchema = z.object({
    Idx: NonNegativeIntegerNumber,
    Name: RequiredString,
    CreatedDate: OptionalJsDate,
});
