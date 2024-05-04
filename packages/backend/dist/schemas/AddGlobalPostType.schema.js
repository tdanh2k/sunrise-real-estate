import z from "zod";
import { NonNegativeIntegerNumber, RequiredString, } from "../utils/ZodUtils.js";
export const AddGlobalPostTypeSchema = z.object({
    Idx: NonNegativeIntegerNumber,
    Name: RequiredString,
    //CreatedDate: OptionalJsDate,
});
