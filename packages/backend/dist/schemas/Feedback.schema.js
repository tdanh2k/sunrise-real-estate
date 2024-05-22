import z from "zod";
import { OptionalJsDate, OptionalUUID, RequiredEmail, RequiredString, } from "../utils/ZodUtils.js";
export const FeedbackSchema = z.object({
    Id: OptionalUUID,
    Name: RequiredString,
    Phone: RequiredString,
    Email: RequiredEmail,
    Title: RequiredString,
    Description: RequiredString,
    CreatedDate: OptionalJsDate,
});
